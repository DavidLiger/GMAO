<?php

namespace App\Service;


use App\Dto\TypeBienDto;
use App\Entity\BienCaracteristique;
use App\Entity\Caracteristique;
use App\Entity\Societe;
use App\Entity\TypeBien;
use App\Repository\BienCaracteristiqueRepository;
use App\Repository\CaracteristiqueTypeBienRepository;
use App\Repository\ComposantRepository;
use App\Repository\EquipementRepository;
use App\Repository\OuvrageRepository;
use App\Repository\SiteRepository;
use DateTime;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Column;
use PhpOffice\PhpSpreadsheet\Worksheet\Row;
use PhpOffice\PhpSpreadsheet\Worksheet\Table;
use PhpOffice\PhpSpreadsheet\Worksheet\Table\TableStyle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TypeBienService
{


    public function __construct(
        private BienCaracteristiqueRepository     $bienCaracteristiqueRepository,
        private EntityManagerInterface            $entityManager,
        private SiteRepository                    $siteRepository,
        private OuvrageRepository                 $ouvrageRepository,
        private EquipementRepository              $equipementRepository,
        private ComposantRepository               $composantRepository,
        private CaracteristiqueTypeBienRepository $caracteristiqueTypeBienRepository,
    )
    {
    }

    public function typeBienDTOTransformer(TypeBienDto $typeBienDto, TypeBien $typeBien, Societe $societe): TypeBien
    {
        $typeBien->setNom($typeBienDto->nom);
        $typeBien->setNature($typeBienDto->nature);
        $typeBien->setSociete($societe);

        // Assurez-vous de définir le champ arbo
        if ($typeBienDto->arbo !== null) {
            $typeBien->setArbo($typeBienDto->arbo);
        }

        return $typeBien;
    }

    public function exelExport(Societe $societe): StreamedResponse
    {

        // Récupération des sites depuis la base de données
        $sites = $societe->getSites();

        // Création du fichier Excel
        $spreadsheet = new Spreadsheet();

        // Feuille 1 : Sites
        $siteSheet = $spreadsheet->getActiveSheet();
        $siteSheet->setTitle("Sites");
        $this->generateSitesSheet($siteSheet, $sites);

        // Feuille 2 : Ouvrages
        $ouvrageSheet = $spreadsheet->createSheet();
        $ouvrageSheet->setTitle("Ouvrages");
        $this->generateOuvragesSheet($ouvrageSheet, $sites);

        // Feuille 3 : Équipements
        $equipementSheet = $spreadsheet->createSheet();
        $equipementSheet->setTitle("Equipements");
        $ouvrageRows = $this->getOuvrageRows($sites);
        $this->generateEquipementsSheet($equipementSheet, $sites, $ouvrageRows);

        // Feuille 4 : Composants
        $composantSheet = $spreadsheet->createSheet();
        $composantSheet->setTitle("Composants");
        $this->generateComposantsSheet($composantSheet, $sites, $ouvrageRows);

        // Exporter le fichier Excel
        $writer = new Xlsx($spreadsheet);
        $response = new StreamedResponse(function () use ($writer) {
            $writer->save('php://output');
        });

        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment;filename="structure.xlsx"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }

    public function setValueExport(array $allCaracteristiques, $bien, Worksheet $sheet, int $rowIndex, int $colIndex): void
    {

        foreach ($allCaracteristiques as $id => $nom) {
            $caracteristique = $bien->getTypeBien()->getCaracteristiqueTypeBiens()->filter(fn($car) => $car->getCaracteristique()->getId() === $id)->first();
            $columnLetter = $this->columnIndexToLetter($colIndex);
            if ($caracteristique) {
                $cell = "$columnLetter$rowIndex";

                $value = $this->bienCaracteristiqueRepository->findOneBy(["bien" => $bien->getId(), "caracteristique" => $caracteristique->getCaracteristique()->getId()]);
                if ($value) {
                    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value->getValeur())) {
                        $value = DateTime::createFromFormat('Y-m-d', $value->getValeur())->format('d/m/Y');
                        $value = Date::PHPToExcel($value);
                    } else {
                        $value = $value->getValeur();
                    }
                } else {
                    $value = $caracteristique->getCaracteristique()->getValeurDefaut();
                }

                $sheet->setCellValue("$columnLetter$rowIndex", $value);
                $this->setDynamicCellType($sheet, $cell, $caracteristique->getCaracteristique());
            } else {
                $sheet->getStyle("$columnLetter$rowIndex")
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setARGB('FFC0C0C0'); // Case grisée si caractéristique absente
                $this->setUnmodifiable($sheet, "$columnLetter$rowIndex", "");
            }
            $colIndex++;
        }
    }

    public function createTable(int $colIndex, int $rowIndex, Worksheet $sheet, int $index): void
    {
        $columnLetter = $this->columnIndexToLetter($colIndex - 1);
        $rowIndex = $rowIndex - 1;
        $table = new Table("A1:{$columnLetter}{$rowIndex}", "Table{$index}");

        $tableStyle = new TableStyle();
        $tableStyle->setTheme(TableStyle::TABLE_STYLE_MEDIUM9);
        $tableStyle->setShowRowStripes(true);
        $table->setStyle($tableStyle);

        $sheet->addTable($table);
    }

    public function exelImport(mixed $file)
    {
        $spreadsheet = IOFactory::load($file);

        $siteSheet = $spreadsheet->getSheetByName('Sites');
        if ($siteSheet) {
            $this->importSites($siteSheet);
        }
        $ouvrageSheet = $spreadsheet->getSheetByName('Ouvrages');
        if ($ouvrageSheet) {
            $this->importOuvrages($ouvrageSheet);
        }

        // Feuille 3 : Équipements
        $equipementSheet = $spreadsheet->getSheetByName('Equipements');
        if ($equipementSheet) {
            $this->importEquipements($equipementSheet);
        }

        // Feuille 4 : Composants
        $composantSheet = $spreadsheet->getSheetByName('Composants');
        if ($composantSheet) {
            $this->importComposants($composantSheet);
        }

        // Sauvegarder les changements en base de données
        $this->entityManager->flush();

    }

    private function generateSitesSheet(Worksheet $sheet, Collection $sites): void
    {
        // Récupérer toutes les caractéristiques uniques des sites
        $allCaracteristiques = [];
        foreach ($sites as $site) {
            foreach ($site->getTypeBien()->getCaracteristiqueTypeBiens() as $caracteristique) {
                $allCaracteristiques[$caracteristique->getCaracteristique()->getId()] = $caracteristique->getCaracteristique()->getNom();
            }
        }

        // Ajouter les en-têtes
        $sheet->setCellValue('A1', 'ID');
        $sheet->setCellValue('B1', 'Site Type');
        $sheet->setCellValue('C1', 'Nom');
        $colIndex = 4;
        foreach ($allCaracteristiques as $id => $nom) {
            $columnLetter = $this->columnIndexToLetter($colIndex);
            $sheet->setCellValue("{$columnLetter}1", $nom . " (ID: $id)");
            $colIndex++;
        }

        // Ajouter les données
        $rowIndex = 2;
        foreach ($sites as $site) {
            $sheet->setCellValue('A' . $rowIndex, $site->getId());
            $this->setUnmodifiable($sheet, "A$rowIndex", $site->getId());

            $sheet->setCellValue('B' . $rowIndex, $site->getTypeBien()->getNom());
            $this->setUnmodifiable($sheet, "B$rowIndex", $site->getTypeBien()->getNom());
            $sheet->getStyle("B$rowIndex")
                ->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()
                ->setARGB('FFC0C0C0'); // Case grisée si caractéristique absente

            $sheet->setCellValue('C' . $rowIndex, $site->getNom());

            $this->setValueExport($allCaracteristiques, $site, $sheet, $rowIndex, 4);
            $rowIndex++;
        }
        $this->createTable($colIndex, $rowIndex, $sheet, 1);
        foreach (range('A', $sheet->getHighestColumn()) as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
        $sheet->getColumnDimension('A')->setVisible(false);

    }

    private function columnIndexToLetter($colIndex): string
    {
        $letter = '';
        while ($colIndex > 0) {
            $mod = ($colIndex - 1) % 26;
            $letter = chr(65 + $mod) . $letter;
            $colIndex = (int)(($colIndex - $mod) / 26);
        }
        return $letter;
    }

    private function setUnmodifiable(Worksheet $sheet, string $cell, $value): void
    {
        $dataValidation = $sheet->getCell($cell)->getDataValidation();
        $dataValidation->setType(DataValidation::TYPE_CUSTOM);
        $dataValidation->setErrorStyle(DataValidation::STYLE_STOP);
        $dataValidation->setAllowBlank(false);
        $dataValidation->setShowErrorMessage(true);
        $dataValidation->setErrorTitle('Modification non autorisée');
        $dataValidation->setError('Vous ne pouvez pas modifier cette valeur.');

        // Adapter la formule selon le type de $value
        if (is_string($value) && str_starts_with($value, '=')) {
            // Si la valeur est une formule, valider qu'elle correspond toujours à elle-même
            $dataValidation->setFormula1("=$cell={$value}");
            $sheet->setCellValue($cell, $value);
        } elseif (is_string($value)) {
            // Échapper les guillemets pour Excel
            $value = str_replace('"', '""', $value);
            $dataValidation->setFormula1("=$cell=\"{$value}\"");
            $sheet->setCellValue($cell, $value);
        } elseif (is_numeric($value)) {
            $dataValidation->setFormula1("=$cell={$value}");
            $sheet->setCellValue($cell, $value);
        } else {
            throw new InvalidArgumentException("Le type de valeur fourni n'est ni un entier ni une chaîne de caractères.");
        }
    }

    private function setDynamicCellType(Worksheet $sheet, string $cell, Caracteristique $caracteristique): void
    {
        $type = $caracteristique->getTypeChamp();
        switch ($type->value) {
            case 'select':
                $options = '"' . implode(',', $caracteristique->getListeValeurs()) . '"';
                // Ajouter une liste déroulante
                $validation = $sheet->getCell($cell)->getDataValidation();
                $validation->setType(DataValidation::TYPE_LIST);
                $validation->setErrorStyle(DataValidation::STYLE_STOP);
                $validation->setAllowBlank($caracteristique->isObligatoire());
                $validation->setShowInputMessage(true);
                $validation->setShowErrorMessage(true);
                $validation->setShowDropDown(true);
                $validation->setFormula1($options); // Remplacez par les vraies options.
                $validation->setErrorTitle('Choix invalide');
                $validation->setError('Veuillez entrer un choix valide.');
                $validation->setPromptTitle('Choix attendue');
                $validation->setPrompt('Choissisez une valeur parmie celle proposées.');
                break;

            case 'date':
                $sheet->getStyle($cell)
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_DATE_DDMMYYYY);
                // Forcer le format date
                $sheet->getStyle($cell)
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_DATE_DDMMYYYY);
                $validation = $sheet->getCell($cell)->getDataValidation();
                $validation->setType(DataValidation::TYPE_DATE);
                $validation->setErrorStyle(DataValidation::STYLE_STOP);
                $validation->setOperator(DataValidation::OPERATOR_BETWEEN);
                $validation->setFormula1('DATE(1900,1,1)'); // Date minimale
                $validation->setFormula2('DATE(9999,12,31)'); // Date maximale
                $validation->setAllowBlank(!$caracteristique->isObligatoire());
                $validation->setShowInputMessage(true);
                $validation->setShowErrorMessage(true);
                $validation->setErrorTitle('Date invalide');
                $validation->setError('Veuillez entrer une date valide.');
                $validation->setPromptTitle('Date attendue');
                $validation->setPrompt('Entrez une date au format JJ/MM/AAAA.');
                break;

            case 'number':
                // Forcer les nombres
                $sheet->getStyle($cell)
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_NUMBER);
                $validation = $sheet->getCell($cell)->getDataValidation();
                $validation->setAllowBlank($caracteristique->isObligatoire());
                $validation->setError('Veuillez entrer un nombre valide.');
                $validation->setShowInputMessage(true);
                $validation->setShowErrorMessage(true);
                break;

            case 'text':
            default:
                // Pas de restriction particulière
                $sheet->getStyle($cell)
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_TEXT);
                $validation = $sheet->getCell($cell)->getDataValidation();
                $validation->setAllowBlank($caracteristique->isObligatoire());
                $validation->setError('Veuillez entrer un text valide.');
                $validation->setShowInputMessage(true);
                $validation->setShowErrorMessage(true);
                break;
        }
    }

    private function generateOuvragesSheet(Worksheet $sheet, Collection $sites): void
    {
        // Vérifier s'il existe au moins un ouvrage
        $hasOuvrage = false;
        foreach ($sites as $site) {
            if ($site->getOuvrages()->count() > 0) {
                $hasOuvrage = true;
                break;
            }
        }

        // Si aucun ouvrage n'est trouvé, afficher un message et arrêter la génération de la feuille
        if (!$hasOuvrage) {
            $sheet->setCellValue('A1', 'Aucun ouvrage disponible');
            return;
        }

        // Récupérer toutes les caractéristiques uniques des ouvrages
        $allCaracteristiques = [];
        foreach ($sites as $site) {
            foreach ($site->getOuvrages() as $ouvrage) {
                foreach ($ouvrage->getTypeBien()->getCaracteristiqueTypeBiens() as $caracteristique) {
                    $allCaracteristiques[$caracteristique->getCaracteristique()->getId()] = $caracteristique->getCaracteristique()->getNom();
                }
            }
        }

        // Ajouter les en-têtes
        $sheet->setCellValue('A1', 'ID');
        $sheet->setCellValue('B1', 'Site');
        $sheet->setCellValue('C1', 'Ouvrage Type');
        $sheet->setCellValue('D1', 'Nom');
        $sheet->setCellValue('E1', 'Ordre d\'affichage');
        $colIndex = 6;
        foreach ($allCaracteristiques as $id => $nom) {
            $columnLetter = $this->columnIndexToLetter($colIndex);
            $sheet->setCellValue("{$columnLetter}1", $nom . " (ID: $id)");
            $colIndex++;
        }

        // Ajouter les données
        $rowIndex = 2;
        $numberSite = 2;
        foreach ($sites as $site) {
            foreach ($site->getOuvrages() as $ouvrage) {
                $sheet->setCellValue('A' . $rowIndex, $ouvrage->getId());
                $this->setUnmodifiable($sheet, "A$rowIndex", $ouvrage->getId());

                $sheet->setCellValue('B' . $rowIndex, "=Sites!C{$numberSite}");
                $sheet->getStyle("B$rowIndex")
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setARGB('FFC0C0C0');

                $sheet->setCellValue('C' . $rowIndex, $ouvrage->getTypeBien()->getNom());
                $this->setUnmodifiable($sheet, "C$rowIndex", $ouvrage->getTypeBien()->getNom());
                $sheet->getStyle("C$rowIndex")
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setARGB('FFC0C0C0');

                $sheet->setCellValue('D' . $rowIndex, $ouvrage->getNom() !== "[nom]" ? $ouvrage->getNom() : $ouvrage->getTypeBien()->getNom());
                $sheet->setCellValue('E' . $rowIndex, $ouvrage->getPosition());

                $this->setValueExport($allCaracteristiques, $ouvrage, $sheet, $rowIndex, 6);
                $rowIndex++;
            }
            $numberSite++;
        }

        $this->createTable($colIndex, $rowIndex, $sheet, 2);
        foreach (range('A', $sheet->getHighestColumn()) as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
        $sheet->getColumnDimension('A')->setVisible(false);
    }


    private function generateEquipementsSheet(Worksheet $sheet, Collection $sites, $ouvrageRows): void
    {
        // Vérifier s'il existe au moins un équipement
        $hasEquipement = false;
        foreach ($sites as $site) {
            if ($site->getEquipements()->count() > 0) {
                $hasEquipement = true;
                break;
            }
        }

        // Si aucun équipement n'est trouvé, afficher un message et arrêter la génération de la feuille
        if (!$hasEquipement) {
            $sheet->setCellValue('A1', 'Aucun équipement disponible');
            return;
        }

        // Récupérer toutes les caractéristiques uniques des équipements
        $allCaracteristiques = [];
        foreach ($sites as $site) {
            foreach ($site->getEquipements() as $equipement) {
                foreach ($equipement->getTypeBien()->getCaracteristiqueTypeBiens() as $caracteristique) {
                    $allCaracteristiques[$caracteristique->getCaracteristique()->getId()] = $caracteristique->getCaracteristique()->getNom();
                }
            }
        }

        // Ajouter les en-têtes
        $sheet->setCellValue('A1', 'ID');
        $sheet->setCellValue('B1', 'Site');
        $sheet->setCellValue('C1', 'Ouvrage');
        $sheet->setCellValue('D1', 'Équipement type');
        $sheet->setCellValue('E1', 'Nom');
        $sheet->setCellValue('F1', 'Relevable');
        $colIndex = 7;
        foreach ($allCaracteristiques as $id => $nom) {
            $columnLetter = $this->columnIndexToLetter($colIndex);
            $sheet->setCellValue("{$columnLetter}1", $nom . " (ID: $id)");
            $colIndex++;
        }

        // Ajouter les données
        $rowIndex = 2;
        $numberSite = 2;
        foreach ($sites as $site) {
            foreach ($site->getEquipements() as $equipement) {
                $sheet->setCellValue('A' . $rowIndex, $equipement->getId());
                $this->setUnmodifiable($sheet, "A$rowIndex", $equipement->getId());

                $sheet->setCellValue('B' . $rowIndex, "=Sites!C{$numberSite}");
                $sheet->getStyle("B$rowIndex")
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setARGB('FFC0C0C0');

                $linkedOuvrage = $equipement->getOuvrage();
                if ($linkedOuvrage) {
                    $ouvrageRow = $ouvrageRows[$linkedOuvrage->getId()] ?? null;
                    if ($ouvrageRow) {
                        $sheet->setCellValue('C' . $rowIndex, "=Ouvrages!D{$ouvrageRow}");
                    }
                } else {
                    $sheet->setCellValue('C' . $rowIndex, "Aucun ouvrage lié");
                }
                $sheet->getStyle("C$rowIndex")
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setARGB('FFC0C0C0');

                $sheet->setCellValue('D' . $rowIndex, $equipement->getTypeBien()->getNom());
                $this->setUnmodifiable($sheet, "D$rowIndex", $equipement->getTypeBien()->getNom());
                $sheet->getStyle("D$rowIndex")
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setARGB('FFC0C0C0');

                $sheet->setCellValue('E' . $rowIndex, $equipement->getNom() !== "[nom]" ? $equipement->getNom() : $equipement->getTypeBien()->getNom());
                $sheet->setCellValue('F' . $rowIndex, $equipement->isRelevable());

                $this->setValueExport($allCaracteristiques, $equipement, $sheet, $rowIndex, 7);

                $rowIndex++;
            }
            $numberSite++;
        }

        $this->createTable($colIndex, $rowIndex, $sheet, 3);
        foreach (range('A', $sheet->getHighestColumn()) as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
        $sheet->getColumnDimension('A')->setVisible(false);
    }


    private function getOuvrageRows(Collection $sites): array
    {
        $ouvrageRows = [];
        $rowIndex = 2; // Ligne de départ pour les ouvrages dans la feuille `Ouvrages`

        foreach ($sites as $site) {
            foreach ($site->getOuvrages() as $ouvrage) {
                $ouvrageRows[$ouvrage->getId()] = $rowIndex;
                $rowIndex++;
            }
        }

        return $ouvrageRows;
    }

    private function generateComposantsSheet(Worksheet $sheet, Collection $sites, $ouvrageRows): void
    {
        // Vérifier s'il existe au moins un composant
        $hasComposant = false;
        foreach ($sites as $site) {
            foreach ($site->getEquipements() as $equipement) {
                if ($equipement->getComposants()->count() > 0) {
                    $hasComposant = true;
                    break 2; // Sortir des deux boucles
                }
            }
        }

        // Si aucun composant n'est trouvé, afficher un message et arrêter la génération
        if (!$hasComposant) {
            $sheet->setCellValue('A1', 'Aucun composant disponible');
            return;
        }

        // --- Reste de la méthode inchangé ---
        // Récupérer toutes les caractéristiques uniques des composants
        $allCaracteristiques = [];
        foreach ($sites as $site) {
            foreach ($site->getEquipements() as $equipement) {
                foreach ($equipement->getComposants() as $composant) {
                    foreach ($composant->getTypeBien()->getCaracteristiqueTypeBiens() as $caracteristique) {
                        $allCaracteristiques[$caracteristique->getCaracteristique()->getId()] = $caracteristique->getCaracteristique()->getNom();
                    }
                }
            }
        }

        // Ajouter les en-têtes
        $sheet->setCellValue('A1', 'ID');
        $sheet->setCellValue('B1', 'Site');
        $sheet->setCellValue('C1', 'Ouvrage');
        $sheet->setCellValue('D1', 'Équipement');
        $sheet->setCellValue('E1', 'Composant Type');
        $sheet->setCellValue('F1', 'Nom');
        $colIndex = 7;
        foreach ($allCaracteristiques as $id => $nom) {
            $columnLetter = $this->columnIndexToLetter($colIndex);
            $sheet->setCellValue("{$columnLetter}1", $nom . " (ID: $id)");
            $colIndex++;
        }

        // Ajouter les données
        $rowIndex = 2;
        $numberSite = 2;
        $numberEquipement = 2;
        foreach ($sites as $site) {
            foreach ($site->getEquipements() as $equipement) {
                foreach ($equipement->getComposants() as $composant) {
                    $sheet->setCellValue('A' . $rowIndex, $composant->getId());
                    $this->setUnmodifiable($sheet, "A$rowIndex", $composant->getId());

                    $sheet->setCellValue('B' . $rowIndex, "=Sites!C{$numberSite}");
                    $sheet->getStyle("B$rowIndex")
                        ->getFill()
                        ->setFillType(Fill::FILL_SOLID)
                        ->getStartColor()
                        ->setARGB('FFC0C0C0');

                    $linkedOuvrage = $equipement->getOuvrage();
                    if ($linkedOuvrage) {
                        $ouvrageRow = $ouvrageRows[$linkedOuvrage->getId()] ?? null;
                        if ($ouvrageRow) {
                            $sheet->setCellValue('C' . $rowIndex, "=Ouvrages!D{$ouvrageRow}");
                        } else {
                            $sheet->setCellValue('C' . $rowIndex, "Aucun ouvrage lié");
                        }
                        $sheet->getStyle("C$rowIndex")
                            ->getFill()
                            ->setFillType(Fill::FILL_SOLID)
                            ->getStartColor()
                            ->setARGB('FFC0C0C0');
                    }

                    $sheet->setCellValue('D' . $rowIndex, "=Equipements!E{$numberEquipement}");
                    $sheet->getStyle("D$rowIndex")
                        ->getFill()
                        ->setFillType(Fill::FILL_SOLID)
                        ->getStartColor()
                        ->setARGB('FFC0C0C0');

                    $sheet->setCellValue('E' . $rowIndex, $composant->getTypeBien()->getNom());
                    $this->setUnmodifiable($sheet, "E$rowIndex", $composant->getTypeBien()->getNom());
                    $sheet->getStyle("E$rowIndex")
                        ->getFill()
                        ->setFillType(Fill::FILL_SOLID)
                        ->getStartColor()
                        ->setARGB('FFC0C0C0');

                    $sheet->setCellValue('F' . $rowIndex, $composant->getNom() !== "[nom]" ? $composant->getNom() : $composant->getTypeBien()->getNom());

                    $this->setValueExport($allCaracteristiques, $composant, $sheet, $rowIndex, 7);

                    $rowIndex++;
                }
                $numberEquipement++;
            }
            $numberSite++;
        }

        $this->createTable($colIndex, $rowIndex, $sheet, 4);
        foreach (range('A', $sheet->getHighestColumn()) as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
        $sheet->getColumnDimension('A')->setVisible(false);
    }

    private function importSites(Worksheet $sheet): void
    {
        foreach ($sheet->getRowIterator() as $row) {
            $site = $this->siteRepository->find((int)$sheet->getCell('A' . $row->getRowIndex())->getValue());
            if ($site) {
                $site->setNom($sheet->getCell('C' . $row->getRowIndex())->getValue());

                if ($sheet->getHighestColumn() >= 'D') {
                    foreach ($sheet->getColumnIterator('D') as $column) {
                        $this->createCarac($column, $sheet, $site, $row);
                    }
                }
            }
        }
    }

    private function importOuvrages(Worksheet $sheet): void
    {
        foreach ($sheet->getRowIterator() as $row) {
            $ouvrage = $this->ouvrageRepository->find((int)$sheet->getCell('A' . $row->getRowIndex())->getValue());
            if ($ouvrage) {
                $ouvrage->setNom($sheet->getCell('D' . $row->getRowIndex())->getValue());
                $ouvrage->setPosition($sheet->getCell('E' . $row->getRowIndex())->getValue());

                if ($sheet->getHighestColumn() >= 'F') {
                    foreach ($sheet->getColumnIterator('F') as $column) {
                        $this->createCarac($column, $sheet, $ouvrage, $row);
                    }
                }
            }
        }
    }

    private function importEquipements(Worksheet $sheet): void
    {
        foreach ($sheet->getRowIterator() as $row) {
            $equipement = $this->equipementRepository->find((int)$sheet->getCell('A' . $row->getRowIndex())->getValue());
            if ($equipement) {
                $equipement->setNom($sheet->getCell('E' . $row->getRowIndex())->getValue());
                $equipement->setRelevable($sheet->getCell('F' . $row->getRowIndex())->getValue());

                if ($sheet->getHighestColumn() >= 'G') {
                    foreach ($sheet->getColumnIterator('G') as $column) {
                        $this->createCarac($column, $sheet, $equipement, $row);
                    }
                }
            }
        }
    }

    private function importComposants(Worksheet $sheet): void
    {
        foreach ($sheet->getRowIterator() as $row) {
            $composant = $this->composantRepository->find((int)$sheet->getCell('A' . $row->getRowIndex())->getValue());
            if ($composant) {
                $composant->setNom($sheet->getCell('F' . $row->getRowIndex())->getValue());

                if ($sheet->getHighestColumn() >= 'G') {
                    foreach ($sheet->getColumnIterator('G') as $column) {
                        $this->createCarac($column, $sheet, $composant, $row);
                    }
                }
            }
        }
    }

    private function getCaracteristiqueIdFromColumn(string $colLetter, Worksheet $sheet): ?Caracteristique
    {
        // Récupère l'ID à partir de l'en-tête (format "Nom de la caractéristique (ID: 123)")
        $header = $sheet->getCell("{$colLetter}1");
        preg_match('/\(ID:\s*(\d+)\)/', $header, $matches);

        if (!isset($matches[1])) {
            return null;
        }

        $caracteristiqueId = (int)$matches[1];

        return $this->entityManager->getRepository(Caracteristique::class)->find($caracteristiqueId);
    }

    private function createCarac(Column $column, Worksheet $sheet, $bien, Row $row): void
    {
        $caracteristique = $this->getCaracteristiqueIdFromColumn($column->getColumnIndex(), $sheet);

        $existingBienCarac = $this->bienCaracteristiqueRepository->findOneBy([
            'bien' => $bien->getId(),
            'caracteristique' => $caracteristique,
        ]);

        if (!$existingBienCarac) {
            $style = $sheet->getStyle($column->getColumnIndex() . $row->getRowIndex());
            $fillColor = $style->getFill()->getStartColor()->getARGB();
            if ($fillColor !== 'FFC0C0C0') {
                $bienCarac = new BienCaracteristique();
                $bienCarac->setBien($bien);
                $bienCarac->setPriorite(
                    $this->caracteristiqueTypeBienRepository->findOneBy([
                        "caracteristique" => $caracteristique,
                        "typeBien" => $bien->getTypeBien()
                    ])->getPriorite() ?? 1);
                $bienCarac->setCaracteristique($caracteristique);
                $bienCarac->setValeur($sheet->getCell($column->getColumnIndex() . $row->getRowIndex())->getValue());
                $this->entityManager->persist($bienCarac);
            }
        } else {
            $bienCarac = $existingBienCarac;
            $bienCarac->setValeur($sheet->getCell($column->getColumnIndex() . $row->getRowIndex())->getValue());
        }
    }
}
