<?php

namespace App\Controller;

use App\Dto\EquipeDto;
use App\Entity\Equipe;
use App\Repository\EquipeRepository;
use App\Repository\UtilisateurRepository;
use App\Security\AccessTokenHandler;
use App\Service\EquipeService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/equipe')]
#[OA\Tag(name: 'Equipe')]
class EquipeController extends ApiController
{
    public function __construct(
        private readonly EquipeRepository      $equipeRepository,
        private readonly UtilisateurRepository $utilisateurRepository,
        private readonly SerializerInterface   $serializer,
        protected AccessTokenHandler           $accessTokenHandler,
        private readonly EquipeService         $equipeService)
    {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('/membre', name: 'app_get_all_equipe_and_membre', methods: ['GET'])]
    public function getAllEquipeAndMembre(): Response
    {
        $equipes = $this->equipeRepository->findBy(['societe' => $this->authenticatedUser->getSocietePrincipal()]);
        return new JsonResponse(json_decode($this->serializer->serialize($equipes, 'json', ['groups' => 'EquipeMembre'])));
    }

    #[Route('', name: 'app_get_all_equipe', methods: ['GET'])]
    public function getAll(): Response
    {
        $equipes = $this->equipeRepository->findBy(['societe' => $this->authenticatedUser->getSocietePrincipal()]);
        return new JsonResponse(json_decode($this->serializer->serialize($equipes, 'json', ['groups' => 'defaultEquipe'])));
    }

    #[Route('/{id}', name: 'app_get_one', methods: ['GET'])]
    public function getOne(Equipe $equipe): Response
    {
        $result = $this->equipeService->formatEquipe($equipe);

        return new JsonResponse($result);
    }

    #[Route('/{id}', name: 'app_edit', methods: ['PUT'])]
    public function update(Equipe $equipe, #[MapRequestPayload] EquipeDto $dto): Response
    {
        $this->equipeService->updateEquipeDTOTransformer($dto, $equipe);

        return new JsonResponse('success');
    }

    #[Route('/{id}', name: 'app_delete', methods: ['DELETE'])]
    public function delete(Equipe $equipe): Response
    {
        $this->equipeRepository->delete($equipe);
        return new JsonResponse('success');
    }

    #[Route('', name: 'app_create_equipe', methods: ['POST'])]
    public function create(#[MapRequestPayload] EquipeDto $dto): Response
    {
        $this->equipeService->createEquipeDTOTransformer($dto, $this->authenticatedUser->getSocietePrincipal());

        return new JsonResponse('success');
    }

    #[Route('/{id}/ajoutmembre', name: 'app_post_ajout_membre', methods: ['POST'])]
    public function ajoutMembre(Equipe $equipe, Request $request): Response
    {
        $data = json_decode($request->getContent(), true); // Convertit le JSON en tableau associatif

        if (isset($data['userId'])) {
            $user = $this->utilisateurRepository->findOneBy(['id' => $data['userId']]);
            $this->equipeService->addMember($user, $equipe);
            return new JsonResponse('sucess', 200);
        }
        return new JsonResponse(['error' => 'userId non trouvé'], 400);
    }

}
