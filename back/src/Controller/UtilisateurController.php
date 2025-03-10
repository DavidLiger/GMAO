<?php

namespace App\Controller;

use App\Dto\CreateUtilisateurDTO;
use App\Dto\UpdateUtilisateurDTO;
use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use App\Security\AccessTokenHandler;
use App\Service\UtilisateurService;
use DateTime;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/utilisateur')]
#[OA\Tag(name: 'Utilisateur')]
class UtilisateurController extends ApiController
{
    public function __construct(
        AccessTokenHandler                     $accessTokenHandler,
        private readonly UtilisateurService    $utilisateurService,
        private readonly SerializerInterface   $serializer,
        private readonly UtilisateurRepository $utilisateurRepository
    )
    {
        parent::__construct($accessTokenHandler);
    }

    #[Route('', name: 'app_api_utilisateur', methods: ['GET'])]
    public function index(SerializerInterface $serializer): Response
    {
        // $data = $serializer->serialize($this->authenticatedUser, 'json');
        $societe = $this->authenticatedUser->getSocietePrincipal();
        $data = [];
        if ($this->authenticatedUser instanceof Utilisateur) {
            $data = [
                'utilisateur' => [
                    'id' => $this->authenticatedUser->getId(),
                    'username' => $this->authenticatedUser->getUsername(),
                    'prenom' => $this->authenticatedUser->getPrenom(),
                    'nom' => $this->authenticatedUser->getNom()
                ],
                'societe' => [
                    'id' => $societe?->getId(),
                    'nom' => $societe?->getNom(),
                    'adresse' => implode(' ', [
                        $societe?->getAdresse1(),
                        $societe?->getAdresse2(),
                        $societe?->getVille()
                    ])
                ]
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('', name: 'app_create_user', methods: ['POST'])]
    public function create(#[MapRequestPayload] CreateUtilisateurDTO $createUtilisateurDTO): Response
    {
        $user = $this->utilisateurRepository->findBy(['username' => $createUtilisateurDTO->username]);

        if ($user === []) {
            $this->utilisateurService->createUtilisateurDTOTransformer($createUtilisateurDTO, $this->authenticatedUser);
            return new JsonResponse('success');
        } else {
            return new JsonResponse('Exist');
        }
    }

    #[Route('/responsable/access', name: 'app_get_responsable_access', methods: ['GET'])]
    public function resposnabelAccess(): Response
    {
        $user = $this->authenticatedUser;

        return new JsonResponse(json_decode($this->serializer->serialize($user, 'json', ['groups' => 'access'])));

    }

    #[Route('/info', name: 'app_get_current_user', methods: ['GET'])]
    public function getInfo(): Response
    {

        $user = $this->authenticatedUser;
        return new JsonResponse(json_decode($this->serializer->serialize($user, 'json', ['groups' => 'UtilisateurInfo'])));
    }


    #[Route('/{id}', name: 'app_delete_one_user', methods: ['DELETE'])]
    public function delete(Utilisateur $user): Response
    {
        $user->setDateDesactivation(new DateTime('now'));
        $this->utilisateurService->delete($user);
        $this->utilisateurRepository->update();
        return new JsonResponse('success');
    }

    #[Route('/mail', name: 'app_test_mail', methods: ['GET'])]
    public function testMail(): Response
    {
        $this->utilisateurService->sendEmail('oscarmidoux31@gmail.com', 'test', 'test');

        return new JsonResponse('sucess');
    }

    #[Route('/{id}', name: 'app_update_user', methods: ['PUT'])]
    public function update(Utilisateur $utilisateur, #[MapRequestPayload] UpdateUtilisateurDTO $updateUtilisateurDTO): Response
    {
        $this->utilisateurService->updateUser($updateUtilisateurDTO, $utilisateur);
        return new JsonResponse('success');
    }

    #[Route('/employe', name: 'app_get_employer', methods: ['GET'])]
    public function getUserHierarchy(): JsonResponse

    {
        // Récupération de l'utilisateur connecté
        $user = $this->authenticatedUser;

        // Vérifiez que l'utilisateur est bien authentifié
        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        // Récupérer la liste aplatie des utilisateurs
        $userHierarchy = $this->utilisateurService->getUserHierarchy($user);

        return $this->json($userHierarchy);
    }

    #[Route('/tree', name: 'user_tree', methods: ['GET'])]
    public function getUserTree(): JsonResponse
    {

        $currentUser = $this->authenticatedUser;

        if (!$currentUser instanceof Utilisateur) {
            return $this->json(['error' => 'Utilisateur non connecté'], 403);
        }

        // Construire la hiérarchie
        $tree = $this->utilisateurService->buildUserTree($currentUser);

        if ($currentUser->getResponsable()) {
            $result = array_merge($tree, [
                "responsable" => [
                    "nom" => $currentUser->getResponsable()->getNom(),
                    "prenom" => $currentUser->getResponsable()->getPrenom(),
                    "email" => $currentUser->getResponsable()->getEmail()
                ],
                'tel2' => $currentUser->getTel2(),
                'societe' => $currentUser->getSocietePrincipal()->getNom(),
            ]);
        } else {
            $result = array_merge($tree, [
                'tel2' => $currentUser->getTel2(),
                'societe' => $currentUser->getSocietePrincipal()->getNom(),
            ]);
        }
        return new JsonResponse($result, 200);
    }

    #[Route('/{id}', name: 'app_get_one_user', methods: ['GET'])]
    public function getOne(Utilisateur $utilisateur): Response
    {

        return new JsonResponse(json_decode($this->serializer->serialize($utilisateur, 'json', ['groups' => 'UtilisateurAll'])));
    }
}
