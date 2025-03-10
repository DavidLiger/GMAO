<?php


namespace App\Controller;

use App\Dto\TypeBienDto;
use App\Entity\TypeBien;
use App\Repository\TypeBienRepository;
use App\Security\AccessTokenHandler;
use App\Service\TypeBienService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/typebien')]
#[OA\Tag(name: 'Type_Bien')]
class TypeBienController extends ApiController
{
    public function __construct(
        private readonly TypeBienRepository  $typeBienRepository,
        private readonly SerializerInterface $serializer,
        private readonly TypeBienService     $typeBienService,
        protected AccessTokenHandler         $accessTokenHandler,
    )
    {
        parent::__construct($this->accessTokenHandler);
    }


    #[Route('', name: 'app_get_all_type_bien', methods: ['GET'])]
    public function getAll(): Response
    {
        $typeBiens = $this->typeBienRepository->findBy(['societe' => $this->authenticatedUser->getSocietePrincipal()]);
        return new JsonResponse(json_decode($this->serializer->serialize($typeBiens, 'json', ['groups' => 'defaultTypeBien'])));
    }

    #[Route('/getOne/{id}', name: 'app_get_one_type_bien', methods: ['GET'])]
    public function getOne(TypeBien $typeBien): Response
    {
        // dd($typeBien);
        return new JsonResponse(json_decode($this->serializer->serialize($typeBien, 'json', ['groups' => 'defaultTypeBien'])));
    }

    #[Route('/nature/{nature}', name: 'app_get_by_nature', methods: ['GET'])]
    public function getTypeBiensByVille(string $nature): Response
    {
        $typeBiens = $this->typeBienRepository->findBy(['nature' => $nature, 'societe' => $this->authenticatedUser->getSocietePrincipal()], ["nom" => "ASC"]);
        // dd($typeBiens);
        return new JsonResponse(json_decode($this->serializer->serialize($typeBiens, 'json', ['groups' => 'defaultTypeBien'])));
    }

    #[Route('', name: 'app_create_typeBien', methods: ['POST'])]
    public function create(#[MapRequestPayload] TypeBienDto $typeBienDto): Response
    {
        $typeBien = $this->typeBienService->typeBienDTOTransformer($typeBienDto, new  TypeBien(), $this->authenticatedUser->getSocietePrincipal());
        $this->typeBienRepository->create($typeBien);

        return new JsonResponse(json_decode($this->serializer->serialize($typeBien, 'json', ['groups' => 'defaultTypeBien'])));
    }

    #[Route('/{id}', name: 'app_update_typeBien', methods: ['PUT'])]
    public function update(TypeBien $typeBien, #[MapRequestPayload] TypeBienDto $typeBienDto): Response
    {
        if ($typeBien->getSociete() !== $this->authenticatedUser->getSocietePrincipal()) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }
        $typeBien = $this->typeBienService->typeBienDTOTransformer($typeBienDto, $typeBien, $this->authenticatedUser->getSocietePrincipal());
        $this->typeBienRepository->update();
        return new JsonResponse(json_decode($this->serializer->serialize($typeBien, 'json', ['groups' => 'defaultTypeBien'])));
    }

    #[Route('/{id}', name: 'app_delete_typeBien', methods: ['DELETE'])]
    public function delete(TypeBien $typeBien): Response
    {
        if ($typeBien->getSociete() !== $this->authenticatedUser->getSocietePrincipal()) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }
        // Appel de la méthode deleteById avec l'ID
        $this->typeBienRepository->delete($typeBien);
        return new JsonResponse(['message' => 'Type bien deleted'], 200);
    }

    #[Route('/{id}/caracteristiques', name: 'app_get_caracteristiques', methods: ['GET'])]
    public function getTypeBienCaracteristique(TypeBien $typeBien): Response
    {
        $caracteristiques = [];
        foreach ($typeBien->getCaracteristiqueTypeBiens() as $caracteristiqueTypeBien) {
            $caracteristiques[] = $caracteristiqueTypeBien->getCaracteristique();
        }
        return new JsonResponse(json_decode($this->serializer->serialize($caracteristiques, 'json', ['groups' => 'minimalCaracteristique'])));
    }

    #[Route('/{id}/arbo', name: 'app_get_arbo', methods: ['GET'])]
    public function getTypeBienarbo(TypeBien $typeBien): Response
    {
        $arbo = $typeBien->getArbo();
        return new JsonResponse(json_decode($this->serializer->serialize($arbo, 'json', ['groups' => 'minimalCaracteristique'])));
    }

    #[Route('/export/caracteristique', name: 'app_get_export', methods: ['GET'])]
    public function getCaracteristiqueSheet(): Response
    {
        return $this->typeBienService->exelExport($this->authenticatedUser->getSocietePrincipal());
    }

    #[Route('/import/caracteristique', name: 'app_post_import', methods: ['POST'])]
    public function getImport(Request $request): Response
    {
        $file = $request->files->get('file'); // Le fichier doit être envoyé sous la clé "file"
        if (!$file) {
            return new JsonResponse(['error' => 'Aucun fichier fourni.'], 400);
        }

        // Vérifier le type du fichier
        if ($file->getClientOriginalExtension() !== 'xlsx' && $file->getClientOriginalExtension() !== 'xls') {
            return new JsonResponse(['error' => 'Format de fichier non supporté.'], 400);
        }
        $this->typeBienService->exelImport($file);
        return new JsonResponse('success');
    }
}
