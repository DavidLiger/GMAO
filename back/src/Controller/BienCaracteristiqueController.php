<?php

namespace App\Controller;

use App\Dto\BienCaracteristiqueDto;
use App\Entity\Bien;
use App\Entity\BienCaracteristique;
use App\Repository\BienCaracteristiqueRepository;
use App\Repository\CaracteristiqueRepository;
use App\Security\AccessTokenHandler;
use App\Service\BienCaracteristiqueService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/bienCaracteristique')]
#[OA\Tag(name: 'BienCaracteristique')]
class BienCaracteristiqueController extends ApiController
{
    public function __construct(
        private readonly BienCaracteristiqueRepository $bienCaracteristiqueRepository,
        private readonly SerializerInterface           $serializer,
        private readonly BienCaracteristiqueService    $bienCaracteristiqueService,
        protected AccessTokenHandler                   $accessTokenHandler,
        private readonly CaracteristiqueRepository     $caracteristiqueRepository
    )
    {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('', name: 'app_get_all_bien_caracteristique', methods: ['GET'])]
    public function getAll(): Response
    {
        $bienCaracteristiques = $this->bienCaracteristiqueRepository->findAll;
        return new JsonResponse(json_decode($this->serializer->serialize($bienCaracteristiques, 'json', ['groups' => 'defaultBienCaracteristique'])));
    }

    #[Route('/{id}', name: 'app_get_one_bien_caracteristique', methods: ['GET'])]
    public function getOne(BienCaracteristique $bienCaracteristique): Response
    {
        return new JsonResponse(json_decode($this->serializer->serialize($bienCaracteristique, 'json', ['groups' => 'defaultBienCaracteristique'])));
    }

    #[Route('', name: 'app_create_bien_caracteristique', methods: ['POST'])]
    public function create(#[MapRequestPayload] BienCaracteristiqueDto $bienCaracteristiqueDto): Response
    {
        $bienCaracteristique = $this->bienCaracteristiqueService->bienCaracteristiqueDTOTransformer($bienCaracteristiqueDto, new  BienCaracteristique());
        $this->bienCaracteristiqueRepository->create($bienCaracteristique);

        return new JsonResponse(json_decode($this->serializer->serialize($bienCaracteristique, 'json', ['groups' => 'defaultBienCaracteristique'])));
    }

    #[Route('/{id}', name: 'app_update_bien_caracteristique', methods: ['PUT'])]
    public function update(Bien $bien, #[MapRequestPayload] BienCaracteristiqueDto $bienCaracteristiqueDto): Response
    {
        $bienCaracteristique = $this->bienCaracteristiqueRepository->findOneBy([
            "bien" => $bien,
            "caracteristique" => $this->caracteristiqueRepository->findOneBy(["id" => $bienCaracteristiqueDto->caracteristiqueId])
        ]);
        $bienCaracteristique->setValeur($bienCaracteristiqueDto->value);
        $bienCaracteristique->setPriorite($bienCaracteristiqueDto->priorite);
        $this->bienCaracteristiqueRepository->update();

        return new JsonResponse(json_decode($this->serializer->serialize($bienCaracteristique, 'json', ['groups' => 'defaultBienCaracteristique'])));
    }

    #[Route('/{id}', name: 'app_delete_bien_caracteristique', methods: ['DELETE'])]
    public function delete(BienCaracteristique $bienCaracteristique): Response
    {
        $this->bienCaracteristiqueRepository->delete($bienCaracteristique);
        return new JsonResponse('sucess');
    }

}
