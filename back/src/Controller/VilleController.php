<?php


namespace App\Controller;

use App\Entity\Ville;
use App\Repository\VilleRepository;
use App\Security\AccessTokenHandler;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/ville')]
#[OA\Tag(name: 'Ville')]
class VilleController extends ApiController
{
    public function __construct(
        private readonly VilleRepository     $villeRepository,
        private readonly SerializerInterface $serializer,
        protected AccessTokenHandler         $accessTokenHandler
    )
    {
        parent::__construct($this->accessTokenHandler);
    }


    #[Route('', name: 'app_get_all_composant', methods: ['GET'])]
    public function getAll(): Response
    {
        $villes = $this->villeRepository->findAll();
        return new JsonResponse(json_decode($this->serializer->serialize($villes, 'json', ['groups' => 'defaultVille'])));
    }

    #[Route('/{id}/sites', name: 'app_get_sites_ville', methods: ['GET'])]
    public function grtSitesByVille(Ville $ville): Response
    {
        $sites = $ville->getSites();
        return new JsonResponse(json_decode($this->serializer->serialize($sites, 'json', ['groups' => 'minimal'])));
    }

    #[Route('/search', name: 'api_ville_search', methods: ['GET'])]
    public function search(Request $request, VilleRepository $villeRepository): JsonResponse
    {
        $searchTerm = $request->query->get('search', '');

        if (empty($searchTerm)) {
            return new JsonResponse([], JsonResponse::HTTP_OK);
        }
        
        // Fetch cities matching the search term
        $villes = $villeRepository->findBySearchTerm($searchTerm);

        // Format the response
        $data = array_map(fn($ville) => [
            'id' => $ville->getId(),
            'nom' => $ville->getNom(),
            'codePostal' => $ville->getCodePostal(),
        ], $villes);

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
