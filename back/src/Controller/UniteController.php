<?php


namespace App\Controller;

use App\Dto\UniteDto;
use App\Entity\Unite;
use App\Repository\UniteRepository;
use App\Security\AccessTokenHandler;
use App\Service\UniteService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/unite')]
#[OA\Tag(name: 'Unite')]
class UniteController extends ApiController
{
    public function __construct(
        private readonly UniteRepository     $uniteRepository,
        private readonly SerializerInterface $serializer,
        private readonly UniteService        $uniteService,
        protected AccessTokenHandler         $accessTokenHandler
    )
    {
        parent::__construct($this->accessTokenHandler);
    }


    #[Route('', name: 'app_get_all_unite', methods: ['GET'])]
    public function getAll(): Response
    {
        $unites = $this->uniteRepository->findAll();
        return new JsonResponse(json_decode($this->serializer->serialize($unites, 'json', ['groups' => 'defaultUnite'])));
    }

    #[Route('/gmao', name: 'app_get_all_unite', methods: ['GET'])]
    public function getAllGmao(): Response
    {
        $unites = $this->uniteRepository->findBy(["isGmao" => true]);
        return new JsonResponse(json_decode($this->serializer->serialize($unites, 'json', ['groups' => 'defaultUnite'])));
    }

    #[Route('', name: 'app_create_unite', methods: ['POST'])]
    public function create(#[MapRequestPayload] UniteDto $uniteDto): Response
    {
        $unite = $this->uniteService->uniteDTOTransformer($uniteDto, new  Unite());
        $this->uniteRepository->create($unite);

        return new JsonResponse(json_decode($this->serializer->serialize($unite, 'json', ['groups' => 'defaultUnite'])));
    }

    #[Route('/{id}', name: 'app_update_unite', methods: ['PUT'])]
    public function update(Unite $unite, #[MapRequestPayload] UniteDto $uniteDto): Response
    {
        $unite = $this->uniteService->uniteDTOTransformer($uniteDto, $unite);
        $this->uniteRepository->update();

        return new JsonResponse(json_decode($this->serializer->serialize($unite, 'json', ['groups' => 'defaultUnite'])));
    }

    #[Route('/{id}', name: 'app_delete_unite', methods: ['DELETE'])]
    public function delete(Unite $unite): Response
    {
        $this->uniteRepository->delete($unite);
        return new JsonResponse('sucess');
    }

}
