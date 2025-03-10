<?php

namespace App\Controller;

use App\Dto\CaracteristiqueTypeBienDto;
use App\Entity\CaracteristiqueTypeBien;
use App\Entity\TypeBien;
use App\Entity\Caracteristique;
use App\Repository\CaracteristiqueTypeBienRepository;
use App\Security\AccessTokenHandler;
use App\Service\CaracteristiqueTypeBienService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/caracteristiqueTypeBien')]
#[OA\Tag(name: 'CaracteristiqueTypeBien')]
class CaracteristiqueTypeBienController extends ApiController
{
    private readonly CaracteristiqueTypeBienRepository $caracteristiqueTypeBienRepository;
    private readonly SerializerInterface $serializer;
    private readonly CaracteristiqueTypeBienService $caracteristiqueTypeBienService;
    private readonly EntityManagerInterface $entityManager; // Déclarez l'EntityManager ici

    public function __construct(
        CaracteristiqueTypeBienRepository $caracteristiqueTypeBienRepository,
        SerializerInterface $serializer,
        CaracteristiqueTypeBienService $caracteristiqueTypeBienService,
        AccessTokenHandler $accessTokenHandler,
        EntityManagerInterface $entityManager // Injectez l'EntityManager ici

    ) {
        parent::__construct($accessTokenHandler); // Appel au constructeur parent
        $this->caracteristiqueTypeBienRepository = $caracteristiqueTypeBienRepository;
        $this->serializer = $serializer;
        $this->caracteristiqueTypeBienService = $caracteristiqueTypeBienService;
        $this->entityManager = $entityManager; // Initialisez l'EntityManager ici
    }
    

    #[Route('/deleteAllByTypeBien/{id}', name: 'app_delete_caracteristique_type_bien', methods: ['DELETE'])]
    public function deleteCaracteristiques(TypeBien $typeBien): Response
    {
        // Supprimer toutes les caractéristiques par typeBienId
        $this->caracteristiqueTypeBienService->deleteAllByTypeBienId($typeBien);

        return new JsonResponse(['status' => 'success'], Response::HTTP_OK);
    }

    #[Route('', name: 'app_get_all_caracteristique_type_bien', methods: ['GET'])]
    public function getAll(): Response
    {
        $caracteristiqueTypeBiens = $this->caracteristiqueTypeBienRepository->findAll();
    
        // Si les relations ne sont pas chargées, vous pouvez les charger ici
        foreach ($caracteristiqueTypeBiens as $caracteristiqueTypeBien) {
            $caracteristiqueTypeBien->getCaracteristique(); // Force le chargement
            $caracteristiqueTypeBien->getTypeBien(); // Force le chargement
        }
    
        return new JsonResponse(json_decode($this->serializer->serialize($caracteristiqueTypeBiens, 'json', ['groups' => 'defaultCaracteristiqueTypeBien'])));
    }

    #[Route('/{id}', name: 'app_get_one_caracteristique_type_bien', methods: ['GET'])]
    public function getOne(CaracteristiqueTypeBien $caracteristiqueTypeBien): Response
    {
        return new JsonResponse(json_decode($this->serializer->serialize($caracteristiqueTypeBien, 'json', ['groups' => 'defaultCaracteristiqueTypeBien'])));
    }

    #[Route('/type-bien/{typeBienId}', name: 'app_get_by_type_bien', methods: ['GET'])]
    public function getByTypeBien(int $typeBienId): Response
    {
        $caracteristiqueTypeBiens = $this->caracteristiqueTypeBienRepository->findByTypeBienId($typeBienId);

        if (!$caracteristiqueTypeBiens) {
            // return new JsonResponse(['message' => 'Aucune donnée trouvée pour ce type de bien.'], Response::HTTP_NOT_FOUND);
            return new JsonResponse([], Response::HTTP_OK);
        }

        return new JsonResponse(json_decode($this->serializer->serialize($caracteristiqueTypeBiens, 'json', ['groups' => 'defaultCaracteristiqueTypeBien'])));
    }

    #[Route('', name: 'app_create_caracteristique_type_bien', methods: ['POST'])]
    public function create(#[MapRequestPayload] CaracteristiqueTypeBienDto $caracteristiqueTypeBienDto): Response
    {
        $caracteristiqueTypeBien = $this->caracteristiqueTypeBienService->caracteristiqueTypeBienDTOTransformer($caracteristiqueTypeBienDto, new CaracteristiqueTypeBien());
        $this->caracteristiqueTypeBienRepository->create($caracteristiqueTypeBien);

        return new JsonResponse(json_decode($this->serializer->serialize($caracteristiqueTypeBien, 'json', ['groups' => 'defaultCaracteristiqueTypeBien'])));
    }

    #[Route('/{typeBien}/{caracteristique}', name: 'app_update_caracteristique_type_bien', methods: ['PUT'])]
    public function update(TypeBien $typeBien, Caracteristique $caracteristique, #[MapRequestPayload] CaracteristiqueTypeBienDto $caracteristiqueTypeBienDto): Response
    {
        // Récupérer l'entité en utilisant les deux identifiants
        $caracteristiqueTypeBien = $this->caracteristiqueTypeBienRepository->findOneBy([
            'typeBien' => $typeBien,
            'caracteristique' => $caracteristique
        ]);
        if (!$caracteristiqueTypeBien) {
            throw $this->createNotFoundException('Caractéristique Type Bien not found');
        }
        $caracteristiqueTypeBien = $this->caracteristiqueTypeBienService->caracteristiqueTypeBienDTOTransformer($caracteristiqueTypeBienDto, $caracteristiqueTypeBien);
        $this->caracteristiqueTypeBienRepository->update($caracteristiqueTypeBien);
        return new JsonResponse(json_decode($this->serializer->serialize($caracteristiqueTypeBien, 'json', ['groups' => 'defaultCaracteristiqueTypeBien'])));
    }

    #[Route('/bulk-update', name: 'app_bulk_update_caracteristique_type_bien', methods: ['PUT'])]
    public function updateMany(#[MapRequestPayload(type: CaracteristiqueTypeBienDto::class)] array $data): Response
    {
        // Vérifier si le TypeBien existe
        $typeBienId = $data[0]->typeBienId ?? null; // On suppose que tous les éléments ont le même typeBienId
        if ($typeBienId === null) {
            return new JsonResponse(['error' => 'TypeBien ID is required'], Response::HTTP_BAD_REQUEST);
        }

        // Utiliser l'EntityManager pour récupérer le repository
        $typeBien = $this->entityManager->getRepository(TypeBien::class)->find($typeBienId);
        if (!$typeBien) {
            return new JsonResponse(['error' => 'TypeBien not found'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer toutes les entités existantes pour le TypeBien donné
        $existingEntities = $this->caracteristiqueTypeBienRepository->findByTypeBienId($typeBienId);
        $existingKeys = [];
        $caracteristiqueIdsInJson = []; // Pour stocker les IDs des caractéristiques présentes dans le JSON

        // Créer un tableau pour stocker les entités existantes par clé composite
        foreach ($existingEntities as $entity) {
            $existingKeys[$entity->getCaracteristique()->getId()] = $entity; // Utiliser uniquement l'ID de la caractéristique comme clé
        }

        // Traiter les données reçues
        foreach ($data as $item) {
            // Créer une instance du DTO
            $caracteristiqueTypeBienDto = new CaracteristiqueTypeBienDto(
                caracteristiqueId: $item->caracteristiqueId,
                typeBienId: $item->typeBienId,
                priorite: $item->priorite ?? null
            );

            $caracteristiqueId = $caracteristiqueTypeBienDto->caracteristiqueId;
            $caracteristiqueIdsInJson[] = $caracteristiqueId; // Ajoutez l'ID à la liste

            if (isset($existingKeys[$caracteristiqueId])) {
                // Mettre à jour l'entité existante
                $caracteristiqueTypeBien = $existingKeys[$caracteristiqueId];
                if ($caracteristiqueTypeBienDto->priorite !== null) {
                    $caracteristiqueTypeBien->setPriorite($caracteristiqueTypeBienDto->priorite);
                }
                // Vous pouvez mettre à jour d'autres propriétés si nécessaire
                $this->entityManager->persist($caracteristiqueTypeBien); // Utilisez persist ici
            } else {
                // Créer une nouvelle entité
                $caracteristiqueTypeBien = new CaracteristiqueTypeBien();
                $caracteristiqueTypeBien->setTypeBien($typeBien); // Utiliser l'entité TypeBien récupérée
                $caracteristiqueTypeBien->setCaracteristique($this->entityManager->getRepository(Caracteristique::class)->find($caracteristiqueId));
                $caracteristiqueTypeBien->setPriorite($caracteristiqueTypeBienDto->priorite ?? null);
                $this->entityManager->persist($caracteristiqueTypeBien); // Utilisez persist ici
            }
        }

        // Supprimer les entités absentes dans le JSON
        foreach ($existingEntities as $entity) {
            $caracteristiqueId = $entity->getCaracteristique()->getId();
            if (!in_array($caracteristiqueId, $caracteristiqueIdsInJson)) {
                $this->entityManager->remove($entity); // Supprimez l'entité si elle n'est pas dans le JSON
            }
        }

        // Enregistrer toutes les modifications
        $this->entityManager->flush(); // N'oubliez pas de flush pour persister les changements

        return new JsonResponse(['status' => 'success'], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'app_delete_caracteristique_type_bien_by_id', methods: ['DELETE'])]
    public function delete(CaracteristiqueTypeBien $caracteristiqueTypeBien): Response
    {
        $this->caracteristiqueTypeBienRepository->delete($caracteristiqueTypeBien);
        return new JsonResponse('success');
    }
}