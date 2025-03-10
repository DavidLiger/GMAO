<?php


namespace App\Controller;

use App\Dto\TypeReleveDto;
use App\Entity\TypeReleve;
use App\Repository\TypeReleveRepository;
use App\Security\AccessTokenHandler;
use App\Service\TypeReleveService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/typereleve')]
#[OA\Tag(name: 'Type_Releve')]
class TypeReleveController extends ApiController
{
    public function __construct(
        private readonly TypeReleveRepository $typeReleveRepository,
        private readonly SerializerInterface  $serializer,
        private readonly TypeReleveService    $typeReleveService,
        protected AccessTokenHandler          $accessTokenHandler
    )
    {
        parent::__construct($this->accessTokenHandler);
    }


    #[Route('', name: 'app_get_all_type_releve', methods: ['GET'])]
    public function getAll(): Response
    {
        $typeReleves = $this->typeReleveRepository->findBy(['societe' => $this->authenticatedUser->getSocietePrincipal()]);
        return new JsonResponse(json_decode($this->serializer->serialize($typeReleves, 'json', ['groups' => 'defaultTypeReleve'])));

    }

    #[Route('', name: 'app_create_type_releve', methods: ['POST'])]
    public function create(#[MapRequestPayload] TypeReleveDto $typeReleveDto): Response
    {
        $typeReleve = $this->typeReleveService->typeReleveDTOTransformer($typeReleveDto, new TypeReleve(), $this->authenticatedUser->getSocietePrincipal()->getId());
        // dd($typeReleve);
        $this->typeReleveRepository->create($typeReleve);

        // $cause = $this->causeService->createCause($causeDto, $this->authenticatedUser ->getSocietePrincipal());
        // $this->causeRepository->create($cause);

        return new JsonResponse(json_decode($this->serializer->serialize($typeReleve, 'json', ['groups' => 'defaultTypeReleve'])));
    }

    #[Route('/{id}', name: 'app_update_type_releve', methods: ['PUT'])]
    public function update(TypeReleve $typeReleve, #[MapRequestPayload] TypeReleveDto $typeReleveDto): Response
    {
        $typeReleve = $this->typeReleveService->typeReleveDTOTransformer($typeReleveDto, $typeReleve);
        $this->typeReleveRepository->update();

        return new JsonResponse(json_decode($this->serializer->serialize($typeReleve, 'json', ['groups' => 'defaultTypeReleve'])));
    }

    #[Route('/{id}', name: 'app_delete_type_releve', methods: ['DELETE'])]
    public function delete(TypeReleve $typeReleve): Response
    {
        $this->typeReleveRepository->delete($typeReleve);
        return new JsonResponse('sucess');
    }

}
