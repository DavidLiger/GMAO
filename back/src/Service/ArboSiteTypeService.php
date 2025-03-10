<?php

namespace App\Service;

use App\Entity\Composant;
use App\Entity\Equipement;
use App\Entity\Ouvrage;
use App\Entity\Site;
use App\Entity\Societe;
use App\Repository\SiteRepository;
use App\Repository\TypeBienRepository;
use App\Repository\VilleRepository;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ArboSiteTypeService
{

    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface      $entityManager,
                                private TypeBienRepository  $typeBienRepository,
                                private SiteRepository      $siteRepository,
                                private VilleRepository     $villeRepository,
                                private HttpClientInterface $httpClient
    )
    {
        $this->entityManager = $entityManager;
    }


    public function createExcelSite(Societe $societe): StreamedResponse
    {
        $sites = $societe->getSites();

        $spreadsheet = new Spreadsheet();
        $siteSheet = $spreadsheet->getActiveSheet();
        $siteSheet->setTitle("Sites");

        // Style des en-têtes
        $styleArray = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 12,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
        ];

        // Définition des en-têtes
        $headers = ['ID', 'Nom', 'Site Type', 'Latitude', 'Longitude', 'Description'];
        $colIndex = 1;
        foreach ($headers as $header) {
            $siteSheet->setCellValue("{$this->columnIndexToLetter($colIndex)}1", $header);
            $colIndex++;
        }
        $siteSheet->getStyle('A1:F1')->applyFromArray($styleArray);

        // Préparation de la liste déroulante pour la colonne C
        $typeBien = $this->typeBienRepository->findBy(['societe' => $societe, 'nature' => 'site']);
        $noms = array_map(fn($objet) => $objet->getNom() . " (ID:" . $objet->getId() . ")", $typeBien);
        $options = '"' . implode(',', $noms) . '"';

        $validation = new DataValidation();
        $validation->setType(DataValidation::TYPE_LIST)
            ->setErrorStyle(DataValidation::STYLE_STOP)
            ->setAllowBlank(true)
            ->setShowDropDown(true)
            ->setFormula1($options)
            ->setErrorTitle('Choix invalide')
            ->setError('Veuillez entrer un choix valide.');

        // Remplissage des données
        $rowIndex = 2;
        foreach ($sites as $site) {
            $siteSheet->setCellValue("A{$rowIndex}", $site->getId());
            $siteSheet->getCell("A{$rowIndex}")->getDataValidation()
                ->setType(DataValidation::TYPE_CUSTOM)
                ->setAllowBlank(false)
                ->setFormula1("=A{$rowIndex}={$site->getId()}")
                ->setShowErrorMessage(true)
                ->setError('Modification non autorisée.');

            $siteSheet->setCellValue("B{$rowIndex}", $site->getNom());
            $typeBienValue = $site->getTypeBien()->getNom() . " (ID:" . $site->getTypeBien()->getId() . ")";
            $siteSheet->setCellValue("C{$rowIndex}", $typeBienValue);
            $siteSheet->getCell("C{$rowIndex}")->getDataValidation()
                ->setType(DataValidation::TYPE_CUSTOM)
                ->setAllowBlank(false)
                ->setFormula1("=C{$rowIndex}=\"{$typeBienValue}\"")
                ->setShowErrorMessage(true)
                ->setErrorTitle('Modification non autorisée')
                ->setError('Vous ne pouvez pas modifier cette valeur.');

            $siteSheet->setCellValue("D{$rowIndex}", $site->getLatitude());
            $siteSheet->setCellValue("E{$rowIndex}", $site->getLongitude());
            $siteSheet->setCellValue("F{$rowIndex}", $site->getDescription());

            $rowIndex++;
        }

        // Boucle pour les lignes vides restantes jusqu'à 2000
        for ($row = $rowIndex; $row <= 2000; $row++) {
            $siteSheet->setCellValue("A{$row}", "X");
            $siteSheet->getCell("A{$row}")->getDataValidation()
                ->setType(DataValidation::TYPE_CUSTOM)
                ->setFormula1("=A{$row}=\"X\"")
                ->setShowErrorMessage(true)
                ->setError('Modification non autorisée.');

            $siteSheet->getCell("C{$row}")->setDataValidation(clone $validation);
        }

        // Ajustement automatique des colonnes
        foreach (range('A', 'F') as $column) {
            $siteSheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Exporter le fichier Excel
        $writer = new Xlsx($spreadsheet);
        $response = new StreamedResponse(function () use ($writer) {
            $writer->save('php://output');
        });

        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment;filename="structureSite.xlsx"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }

    public function exelImport($file, Societe $societe)
    {
        $spreadsheet = IOFactory::load($file->getPathname());
        $sheet = $spreadsheet->getActiveSheet();

        foreach ($sheet->getRowIterator(2) as $row) {

            if ($sheet->getCell('B' . $row->getRowIndex())->getValue() === null) {
                return;
            }
            $url = sprintf(
                'https://nominatim.openstreetmap.org/reverse?format=json&lat=%f&lon=%f&addressdetails=1',
                $sheet->getCell('D' . $row->getRowIndex())->getValue(),
                $sheet->getCell('E' . $row->getRowIndex())->getValue(),
            );


            if ($sheet->getCell('A' . $row->getRowIndex())->getValue() !== 'X') {


                $site = $this->siteRepository->find($sheet->getCell('A' . $row->getRowIndex())->getValue());

                if ($site->getLongitude() === $sheet->getCell('E' . $row->getRowIndex())->getValue() &&
                    $site->getLatitude() === $sheet->getCell('F' . $row->getRowIndex())->getValue()) {
                    $response = $this->httpClient->request('GET', $url, [
                        'verify_peer' => PHP_OS_FAMILY !== 'Windows',  // Désactive la vérification SSL
                        'verify_host' => PHP_OS_FAMILY !== 'Windows',  // Désactive la vérification de l'hôte
                    ]);
                    $data = $response->toArray();

                    $site->setLatitude($sheet->getCell('D' . $row->getRowIndex())->getValue());
                    $site->setLongitude($sheet->getCell('E' . $row->getRowIndex())->getValue());
                    $site->setVille(
                        $this->villeRepository->findOneBy([
                            "nom" => $data['address']['city'] ?? $data['address']['town'] ?? $data['address']['village'],
                            "codePostal" => $data['address']["postcode"]])
                    );

                }

                $site->setNom($sheet->getCell('B' . $row->getRowIndex())->getValue());
                $site->setsociete($societe);
                $site->setDescription($sheet->getCell('F' . $row->getRowIndex())->getValue());
                $this->siteRepository->update();
            } else {

                $response = $this->httpClient->request('GET', $url, [
                    'verify_peer' => PHP_OS_FAMILY !== 'Windows',  // Désactive la vérification SSL
                    'verify_host' => PHP_OS_FAMILY !== 'Windows',  // Désactive la vérification de l'hôte
                ]);
                $data = $response->toArray();

                $site = new Site();
                $site->setNom($sheet->getCell('B' . $row->getRowIndex())->getValue());
                if (preg_match('/ID:(\d+)/', $sheet->getCell('C' . $row->getRowIndex())->getValue(), $matches)) {
                    $id = $matches[1]; // Le chiffre capturé
                    $site->setTypeBien($this->typeBienRepository->find($id));
                }
                $site->setsociete($societe);
                $site->setLatitude($sheet->getCell('D' . $row->getRowIndex())->getValue());
                $site->setLongitude($sheet->getCell('E' . $row->getRowIndex())->getValue());
                $site->setDescription($sheet->getCell('F' . $row->getRowIndex())->getValue());
                $site->setVille(
                    $this->villeRepository->findOneBy([
                        "nom" => $data['address']['city'] ?? $data['address']['town'] ?? $data['address']['village'],
                        "codePostal" => $data['address']["postcode"]])
                );
                $this->siteRepository->create($site);
                $this->createArborescence($site, $societe);
            }
        }
    }

    public function createArborescence(Site $site, Societe $societe): void
    {
        $data = $site->getTypeBien()->getArbo();

        // Précharger les types nécessaires
        $typeIds = [];
        if (isset($data['ouvrages'])) {
            $typeIds = array_merge($typeIds, array_column($data['ouvrages'], 'id_type'));
            foreach ($data['ouvrages'] as $ouvrageData) {
                if (isset($ouvrageData['equipements'])) {
                    $typeIds = array_merge($typeIds, array_column($ouvrageData['equipements'], 'id_type'));
                    foreach ($ouvrageData['equipements'] as $equipementData) {
                        if (isset($equipementData['composants'])) {
                            $typeIds = array_merge($typeIds, array_column($equipementData['composants'], 'id_type'));
                        }
                    }
                }
            }
        }
        if (isset($data['equipements'])) {
            $typeIds = array_merge($typeIds, array_column($data['equipements'], 'id_type'));
            foreach ($data['equipements'] as $equipementData) {
                if (isset($equipementData['composants'])) {
                    $typeIds = array_merge($typeIds, array_column($equipementData['composants'], 'id_type'));
                }
            }
        }

        $types = $this->typeBienRepository->findBy(['id' => array_unique($typeIds)]);
        $typeCache = [];
        foreach ($types as $type) {
            $typeCache[$type->getId()] = $type;
        }

        // Traiter les ouvrages
        if (isset($data['ouvrages'])) {
            foreach ($data['ouvrages'] as $ouvrageData) {
                $ouvrage = new Ouvrage();
                $ouvrage->setNom('[nom]');
                $ouvrage->setTypeBien($typeCache[$ouvrageData['id_type']] ?? null);
                $ouvrage->setsociete($societe);
                $ouvrage->setPosition(0);
                $ouvrage->setSite($site);

                $this->processEquipements($ouvrageData['equipements'] ?? [], $site, $societe, $typeCache, $ouvrage);
                $this->entityManager->persist($ouvrage);
            }
        }

        // Traiter les équipements sans ouvrages
        if (isset($data['equipements'])) {
            $this->processEquipements($data['equipements'], $site, $societe, $typeCache);
        }

        $this->entityManager->persist($site);
        $this->entityManager->flush();
    }

    private function processEquipements(array $equipementsData, Site $site, Societe $societe, array $typeCache, ?Ouvrage $ouvrage = null): void
    {
        foreach ($equipementsData as $equipementData) {
            $equipement = new Equipement();
            $equipement->setNom('[nom]');
            $equipement->setTypeBien($typeCache[$equipementData['id_type']] ?? null);
            $equipement->setsociete($societe);
            $equipement->setSite($site);
            $equipement->setRelevable(false);

            if ($ouvrage) {
                $equipement->setOuvrage($ouvrage);
            }
            if (isset($equipementData['composants'])) {
                foreach ($equipementData['composants'] as $composantData) {
                    $composant = new Composant();
                    $composant->setNom('[nom]');
                    $composant->setTypeBien($typeCache[$composantData['id_type']] ?? null);
                    $composant->setsociete($societe);
                    $composant->setEquipement($equipement);

                    $this->entityManager->persist($composant);
                }
            }

            $this->entityManager->persist($equipement);
        }
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

}