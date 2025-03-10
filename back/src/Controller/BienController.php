<?php

namespace App\Controller;

use App\Dto\UpdateBienDto;
use App\Entity\Bien;
use App\Repository\BienCaracteristiqueRepository;
use App\Repository\BienRepository;
use App\Repository\CaracteristiqueRepository;
use App\Security\AccessTokenHandler;
use App\Service\BienService;
use App\Service\ComposantService;
use App\Service\EquipementService;
use App\Service\FileLoader;
use App\Service\FileUploader;
use App\Service\OuvrageService;
use App\Service\SiteService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/bien')]
#[OA\Tag(name: 'Bien')]
class BienController extends ApiController
{
    public function __construct(
        protected AccessTokenHandler          $accessTokenHandler,
        private readonly BienService          $bienService,
        private readonly SiteService          $siteService,
        private readonly OuvrageService       $ouvrageService,
        private readonly EquipementService    $equipementService,
        private readonly ComposantService     $composantService,
        private readonly SerializerInterface  $serializer,
        private FileUploader                  $fileUploader,
        private readonly BienRepository       $bienRepository,
        private readonly FileLoader           $fileLoader,
        private CaracteristiqueRepository     $caracteristiqueRepository,
        private BienCaracteristiqueRepository $bienCaracteristiqueRepository
    )
    {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('/tree/{id}', name: 'app_get_tree', methods: ['GET'])]
    public function getTree(Bien $bien): Response
    {
        if ($bien->getsociete() === $this->authenticatedUser->getSocietePrincipal()) {
            $result = $this->bienService->getTree($bien);
            return new JsonResponse($result);
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/deleteimage/{id}', name: 'app_delete_image', methods: ['DELETE'])]
    public function deleteImage(Bien $bien): Response
    {
        $this->fileUploader->deleteFile($bien->getImage());
        $bien->setImage(null);
        $this->bienRepository->update();
        return new JsonResponse(['message' => 'success'], 200);
    }

    #[Route('/{id}', name: 'app_delete_bien', methods: ['DELETE'])]
    public function deleteSite(Bien $bien): Response
    {
        if ($bien->getTypeBien()->getNature()->value === 'site') {
            $this->siteService->delete($bien);
        }
        if ($bien->getTypeBien()->getNature()->value === 'ouvrage') {
            $this->ouvrageService->delete($bien);
        }
        if ($bien->getTypeBien()->getNature()->value === 'equipement') {
            $this->equipementService->delete($bien);
        }
        if ($bien->getTypeBien()->getNature()->value === 'composant') {
            $this->composantService->delete($bien);
        }

        return new JsonResponse(['message' => 'success'], 200);
    }

    #[Route('/{id}', name: 'app_get_one_bien', methods: ['GET'])]
    public function getOne(Bien $bien): Response
    {
        $data = json_decode($this->serializer->serialize($bien, 'json', ['groups' => 'defaultBien']), true);

        // Ajouter l'image encodée en Base64
        if ($bien->getImage() !== null) {
            $data['image'] = $this->fileLoader->getBase64Image($bien->getImage());
        }
        if ($bien->getTypeBien()->getNature() === 'site') {
            $arbo = $bien->getTypeBien()->getArbo();
            $data['hasOuvrage'] = isset($arbo['ouvrages']);
        } else {
            $data['hasOuvrage'] = false;
        }
        return new JsonResponse($data);
    }

    #[Route('/breadcrumbs/{id}', name: 'app_get_breadcrumbs', methods: ['GET'])]
    public function getBreadcrumbs(Bien $bien): Response
    {
        $result = $bien->getBreadcrumbs();
        return new JsonResponse($result);

    }

    #[Route('/{id}/children', name: 'app_get_children', methods: ['GET'])]
    public function getChildren(Bien $bien): Response
    {
        $result = $bien->getChildren();
        return new JsonResponse(json_decode($this->serializer->serialize($result, 'json', ['groups' => 'minimal'])));

    }

    #[Route('/{id}/caracteristiques', name: 'app_get_carac', methods: ['GET'])]
    public function getCarac(Bien $bien): Response
    {
        $result = $bien->getCaracteristiques();
        return new JsonResponse(json_decode($this->serializer->serialize($result, 'json', ['groups' => 'bienCarac'])));

    }

    #[Route('/{id}', name: 'app_update_bien', methods: ['PUT'])]
    public function updateBien(Bien $bien, #[MapRequestPayload] UpdateBienDto $dto): Response
    {


        $bien->setNom($dto->nom);
        $bien->setDescription($dto->description);
        $ancienChemin = $bien->getImage();
        if ($ancienChemin) {
            // Supprimez l'ancien fichier
            $this->fileUploader->deleteFile($ancienChemin);
        }
        $chemin = $this->fileUploader->uploadBienImageBase64($dto->image, $bien->getsociete()->getId(), $bien->getId(), $bien->getNom());
        $bien->setImage($chemin);
        $this->bienRepository->update();
        return new JsonResponse('success');

    }

    #[Route('/caracteristique/{id}', name: 'app_delete_one_carac_bien', methods: ['DELETE'])]
    public function deleteOneCarac(Bien $bien, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['id'])) {
            return new JsonResponse(['error' => 'Missing id'], 400);
        }

        $caracteristique = $this->caracteristiqueRepository->findOneBy(['id' => $data['id']]);
        // Récupération de l'association entre le Bien et la Caractéristique
        $bienCaracteristique = $this->bienCaracteristiqueRepository->findOneBy(['bien' => $bien, 'caracteristique' => $caracteristique]);

        if (!$bienCaracteristique) {
            return new JsonResponse(['error' => 'Caracteristique not found for this bien'], 404);
        }

        // Suppression de l'association
        $this->bienCaracteristiqueRepository->delete($bienCaracteristique);

        return new JsonResponse(['status' => 'Caracteristique deleted successfully'], 200);
    }

    #[Route('/caracteristiques/{id}', name: 'app_handle_carac_bien', methods: ['POST'])]
    public function handleCarac(Bien $bien, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $this->bienService->handleCarac($bien, $data);

        return new JsonResponse(['status' => 'Caracteristique updated successfully'], 200);
    }

}
