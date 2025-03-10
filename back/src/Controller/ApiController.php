<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Security\AccessTokenHandler;
use App\Entity\Utilisateur;

/**
 * Classe à étendre aux autres controllers pour l'authentification globale
 *
 * @author fabrice.dant
 *        
 */
abstract class ApiController extends AbstractController
{

    protected AccessTokenHandler $accessTokenHandler;

    /**
     * Cet objet n'est chargé que dans le cas d'un "password" grant.
     * Pour "client_credentials", il n'y a pas de user authentifié.
     * L'authentification se fait uniquement avec les client_id et client_secret dans le cadre de requêtes faites de serveur à serveur.
     *
     * @var \App\Entity\Utilisateur
     */
    protected ?Utilisateur $authenticatedUser;

    public function __construct(AccessTokenHandler $accessTokenHandler)
    {
        $this->accessTokenHandler = $accessTokenHandler;
        $this->authenticatedUser = $this->accessTokenHandler->getUserBadge()?->getUser();
    }
}
