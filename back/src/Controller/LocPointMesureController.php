<?php

namespace App\Controller;

use App\Dto\LocPointMesureTypeBienDto;
use App\Entity\LocPointMesure;
use App\Entity\TypeBien;
use App\Repository\LocPointMesureRepository;
use App\Repository\LocPointMesureTypeBienRepository;
use App\Repository\TypeBienRepository;
use App\Security\AccessTokenHandler;
use App\Service\LocPointMesureTypeBienService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/locpointmesure')]
#[OA\Tag(name: 'LocPointMesure')]
class LocPointMesureController extends ApiController
{
    public function __construct(
        protected AccessTokenHandler                      $accessTokenHandler,
        private readonly LocPointMesureRepository         $locPointMesureRepository,
        private readonly LocPointMesureTypeBienService    $locPointMesureTypeBienService,
        private readonly LocPointMesureTypeBienRepository $locPointMesureTypeBienRepository,
        private readonly TypeBienRepository               $typeBienRepository
    )
    {
        parent::__construct($this->accessTokenHandler);
    }


    #[Route('', name: 'app_get_all_loc_point_mesure', methods: ['GET'])]
    public function getAll(): Response
    {
        $locPointMesures = $this->locPointMesureRepository->findBy([], ["nom" => "ASC"]);
        $result = [];
        foreach ($locPointMesures as $locPointMesure) {
            $temp = [
                "baseDesc" => $locPointMesure->getDescription(),
                "id" => $locPointMesure->getId(),
                "nom" => $locPointMesure->getNom()
            ];
            $result[] = $temp;
        }
        return new JsonResponse($result);
    }

    #[Route('/{id}/allowdelete', name: 'app_get_allow_delete', methods: ['GET'])]
    public function allowDelete(TypeBien $typeBien): Response
    {
        $result = $typeBien->getBiens();
        return new JsonResponse($result->isEmpty());
    }

    #[Route('/{id}/{id2}', name: 'app_get_delete', methods: ['DELETE'])]
    public function delete(LocPointMesure $locPointMesure, $id2): Response
    {
        $typeBien = $this->typeBienRepository->findOneBy(['id' => $id2]);
        $result = $this->locPointMesureTypeBienRepository->findOneBy(['locPointMesure' => $locPointMesure, 'typeBien' => $typeBien]);

        if ($result !== null) {
            $this->locPointMesureTypeBienRepository->delete($result);
        }
        return new JsonResponse('success');
    }

    #[Route('/typebien/{id}', name: 'app_get_all_loc_point_mesure_by_type_bien', methods: ['GET'])]
    public function getAllPointBySite(TypeBien $typeBien): Response
    {
        $result = [];
        $locPointMesureTypeBiens = $this->locPointMesureTypeBienRepository->findBy(['typeBien' => $typeBien]);
        foreach ($locPointMesureTypeBiens as $locPointMesureTypeBien) {
            $temp = [
                "valeurDefaut" => $locPointMesureTypeBien->getValeurDefaut(),
                "description" => $locPointMesureTypeBien->getLocPointMesure()->getDescription(),
                "id" => $locPointMesureTypeBien->getLocPointMesure()->getId(),
                "nom" => $locPointMesureTypeBien->getLocPointMesure()->getNom()
            ];
            $result[] = $temp;
        }
        return new JsonResponse($result);
    }

    #[Route('/typebien', name: 'app_create_loc_point_mesure_type_bien', methods: ['POST'])]
    public function createBatch(#[MapRequestPayload(type: LocPointMesureTypeBienDto::class)] array $locPointMesureTypeBiens, ValidatorInterface $validator): Response
    {
        $errors = [];

        foreach ($locPointMesureTypeBiens as $index => $locPointMesureTypeBien) {
            if (!$locPointMesureTypeBien instanceof LocPointMesureTypeBienDto) {
                throw new BadRequestHttpException("Chaque élément du tableau doit être un CaracteristiqueBatchDto.");
            }

            // Valider chaque DTO
            $violations = $validator->validate($locPointMesureTypeBien);
            if (count($violations) > 0) {
                $errors[$index] = (string)$violations;
            }
        }

        if (!empty($errors)) {
            return new JsonResponse(['errors' => $errors], 400);
        }

        foreach ($locPointMesureTypeBiens as $locPointMesureTypeBien) {
            $this->locPointMesureTypeBienService->locPointMesureTypeBienDTOTransformer($locPointMesureTypeBien);
        }

        return new JsonResponse(['message' => 'Les caractéristiques ont été créées avec succès.'], 201);
    }

}
