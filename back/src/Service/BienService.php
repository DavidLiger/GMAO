<?php

namespace App\Service;


use App\Entity\Bien;
use App\Entity\BienCaracteristique;
use App\Repository\BienCaracteristiqueRepository;
use App\Repository\CaracteristiqueRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;

readonly class BienService
{
    public function __construct(
        private EntityManagerInterface        $entityManager,
        private CaracteristiqueRepository     $caracteristiqueRepository,
        private BienCaracteristiqueRepository $bienCaracteristiqueRepository)
    {
    }

    public function getTree($bien): array
    {
        $treeData = [];

        // Récupérer les enfants de l'objet courant
        $children = $this->getChildren($bien);

        // Séparer les ouvrages des autres enfants
        $ouvrages = [];
        $autres = [];
        foreach ($children as $child) {
            // Supposons que les ouvrages possèdent une méthode getPosition()
            if (method_exists($child, 'getPosition')) {
                $ouvrages[] = $child;
            } else {
                $autres[] = $child;
            }
        }

        // Trier uniquement les ouvrages par leur position
        usort($ouvrages, function ($a, $b) {
            return $a->getPosition() <=> $b->getPosition();
        });

        // Fusionner les ouvrages triés et les autres (l'ordre des autres reste inchangé)
        $sortedChildren = array_merge($ouvrages, $autres);

        foreach ($sortedChildren as $child) {
            $childData = [
                'id' => $child->getId(),
                'nom' => $child->getNom(),
                'nature' => $child->getTypeBien()->getNature(),
                'children' => $this->getTree($child), // Récursion pour les enfants
            ];
            $treeData[] = $childData;
        }

        // Ajouter des points de mesure si disponibles
        if (method_exists($bien, 'getLocPointMesureSites')) {
            $pointMesures = $bien->getLocPointMesureSites();
            if ($pointMesures && !$pointMesures->isEmpty()) {
                $arrayPointMesure = [
                    'id' => 0,
                    'nom' => 'Point de mesure',
                    'children' => [],
                ];
                foreach ($pointMesures as $pointMesure) {
                    $arrayPointMesure['children'][] = [
                        'id' => $pointMesure->getLocPointMesureId()->getId(),
                        'nom' => $pointMesure->getLocPointMesureId()->getNom(),
                    ];
                }
                $treeData[] = $arrayPointMesure;
            }
        }

        return $treeData;
    }

    public function handleCarac(Bien $bien, mixed $data)
    {
        foreach ($data as $carac) {
            $completeCarac = $this->caracteristiqueRepository->findOneBy(['id' => $carac['id']]);
            $bienCarac = $this->bienCaracteristiqueRepository->findOneBy(['bien' => $bien, 'caracteristique' => $completeCarac]);
            if ($bienCarac !== null) {
                $bienCarac->setPriorite($carac['priorite']);
                $bienCarac->setValeur($carac['value']);
                $this->bienCaracteristiqueRepository->persist($bienCarac);
            } else {
                $newBienCarac = new BienCaracteristique();
                $newBienCarac->setBien($bien);
                $newBienCarac->setCaracteristique($completeCarac);
                $newBienCarac->setValeur($carac['value']);
                $newBienCarac->setPriorite(1);
                $this->bienCaracteristiqueRepository->persist($newBienCarac);
            }
        }

        $this->entityManager->flush();
    }

    /**
     * Méthode générique pour récupérer les enfants d'un objet.
     */
    private function getChildren($entity): array
    {
        // Vérifie si une méthode `getChildren` existe
        if (method_exists($entity, 'getChildren')) {
            $children = $entity->getChildren();

            // Vérifie si les enfants existent et ne sont pas vides
            if ($children instanceof Collection && !$children->isEmpty()) {
                return $children->toArray(); // Convertit la Collection en tableau
            }

            // Retourne un tableau vide si pas d'enfants ou collection vide
            return [];
        }

        // Vérifie pour les autres méthodes possibles
        $methods = ['getOuvrages', 'getEquipements', 'getComposants'];
        foreach ($methods as $method) {
            if (method_exists($entity, $method)) {
                $children = $entity->$method();

                // Vérifie si les enfants existent et ne sont pas vides
                if ($children instanceof Collection && !$children->isEmpty()) {
                    return $children->toArray(); // Convertit la Collection en tableau
                }

                // Retourne un tableau vide si pas d'enfants ou collection vide
                return [];
            }
        }

        // Si aucun enfant trouvé ou méthode inexistante, retourne un tableau vide
        return [];
    }
}