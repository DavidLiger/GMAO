<?php

namespace App\Controller;

use App\Dto\ReleveDto;
use App\Entity\Releve;
use App\Repository\ReleveRepository;
use App\Security\AccessTokenHandler;
use App\Service\ReleveService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/releve')]
#[OA\Tag(name: 'Releve')]
class ReleveController extends ApiController
{
    public function __construct(
        private readonly ReleveRepository    $releveRepository,
        private readonly SerializerInterface $serializer,
        private readonly ReleveService       $releveService,
        protected AccessTokenHandler         $accessTokenHandler
    )
    {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('', name: 'app_get_all_releve', methods: ['GET'])]
    public function getAll(): Response
    {
        $releves = $this->releveRepository->findAll();
        return new JsonResponse(json_decode($this->serializer->serialize($releves, 'json', ['groups' => 'defaultReleve'])));
    }

    #[Route('/{id}', name: 'app_get_one_releve', methods: ['GET'])]
    public function getOne(Releve $releve): Response
    {
        return new JsonResponse(json_decode($this->serializer->serialize($releve, 'json', ['groups' => 'defaultReleve'])));
    }

    #[Route('', name: 'app_create_releve', methods: ['POST'])]
    public function create(#[MapRequestPayload] ReleveDto $releveDto): Response
    {
        $releve = $this->releveService->releveDTOTransformer($releveDto, new Releve());
        $this->releveRepository->create($releve);

        return new JsonResponse(json_decode($this->serializer->serialize($releve, 'json', ['groups' => 'defaultReleve'])));
    }

    #[Route('/{id}', name: 'app_update_releve', methods: ['PUT'])]
    public function update(Releve $releve, #[MapRequestPayload] ReleveDto $releveDto): Response
    {
        $releve = $this->releveService->releveDTOTransformer($releveDto, $releve);
        $this->releveRepository->update();

        return new JsonResponse(json_decode($this->serializer->serialize($releve, 'json', ['groups' => 'defaultReleve'])));
    }

    #[Route('/{id}', name: 'app_delete_releve', methods: ['DELETE'])]
    public function delete(Releve $releve): Response
    {
        $this->releveRepository->delete($releve);
        return new JsonResponse('sucess');
    }
}
