<?php

namespace App\Controller;

use App\Security\AccessTokenHandler;
use App\Service\ArboSiteTypeService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/arbositetype')]
#[OA\Tag(name: 'ArboSiteType')]
class ArboSiteTypeController extends ApiController
{
    public function __construct(
        private readonly ArboSiteTypeService $arboSiteTypeService,
        protected AccessTokenHandler         $accessTokenHandler,
    )
    {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('/export/site', name: 'app_get_export_site', methods: ['GET'])]
    public function getExportSite(): Response
    {
        return $this->arboSiteTypeService->createExcelSite($this->authenticatedUser->getSocietePrincipal());
    }

    #[Route('/import/site', name: 'app_post_import_site', methods: ['POST'])]
    public function getImportSite(Request $request): Response
    {
        $file = $request->files->get('file'); // Le fichier doit être envoyé sous la clé "file"
        if (!$file) {
            return new JsonResponse(['error' => 'Aucun fichier fourni.'], 400);
        }

        // Vérifier le type du fichier
        if ($file->getClientOriginalExtension() !== 'xlsx' && $file->getClientOriginalExtension() !== 'xls') {
            return new JsonResponse(['error' => 'Format de fichier non supporté.'], 400);
        }
        $this->arboSiteTypeService->exelImport($file, $this->authenticatedUser->getSocietePrincipal());
        return new JsonResponse('success');
    }
}
