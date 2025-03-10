# Procédure d'installation et de création d'un nouveau projet Symfony 7 de type plateforme API avec Oauth2

Pour la création d'un projet squelette d'API, nous allons déployer un serveur Oauth2 (avec le bundle ``league/oauth2-server-bundle``), une doc listant les endpoints de cette API (avec le bundle ``Swagger`` uniquement sur serveur de dév) sur l'URI "/api/doc" et la gestion du cross-domain avec ``nelmio/cors-bundle``.

Suivre ces étapes ne devrait pas prendre plus d'une demi heure dans le cas où Apache/Nginx, PHP et MySQL sont déjà installés et configurés correctement.

## I- INSTALLATION DE BASE

```bash
# Pour utiliser tous les composants de Swagger, il est préférable de créer un projet de type "webapp" avec la majeure partie des composants Symfony pour créer un site Web (twig est requis pour Swagger)
symfony new [project-name] --webapp
cd [project-namme]
# Le bundle OAuth2
composer require league/oauth2-server-bundle
# Pour le cross-domain
composer require nelmio/cors-bundle
# Pour la doc API
composer require timeinc/swagger-bundle --dev

# Optionnels (on peut se contenter de symfony/http-foundation). Cela permet d'utiliser l'objet "request" avec utilisation de middlewares (bridge).
# Dans le doute, inutile d'installer les paquets suivants.
composer require symfony/psr-http-message-bridge
composer require nyholm/psr7


# Il faut créer une paire de clés pour le système JWT
cd config
mkdir jwt
openssl genrsa -out private.pem
openssl rsa -in private.pem -pubout -out public.pem
```

Sous Linux, il faut permettre à "www-data" (le user Apache, car le serveur Apache exécute ses processus avec un nom d'utilisateur) de lire les fichiers ".pem" (mais pas de les écrire et il faut également rendre en prod ces fichiers invisibles pour tout autre utilisateur). 

### 1- Le fichier ``.env`` (et en dev, le fichier ``.env.local``)

Il faut bien entendu changer le paramètre ``DATABASE_URL`` pour se connecter à sa propre base de données MySQL.

Mais il faut jeter un oeil sur ce que les bundles "oauth2" et "cors" ont rajoutés au fichier ``.env`` et qu'il faut aussi répercuter sur le fichier ``.env.local``.

La conf pour "Nelmio/Cors" est à changer pour permettre le cross-domain.

```env
###> league/oauth2-server-bundle ###
### IL N'Y A RIEN A CHANGER ICI !!!
OAUTH_PRIVATE_KEY=%kernel.project_dir%/config/jwt/private.pem
OAUTH_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
## Le passphrase doit être celui que l'on a renseigné pour créer les clés, mais ce passphrase n'est pas obligatoire. En dev, ne pas renseigner de passphrase, c'est plus simple
OAUTH_PASSPHRASE=123456789randompass
## Cette clé sert principalement à crypter les access_token.
## Elle sera donc nécessaire pour décrypter ces access_token.
OAUTH_ENCRYPTION_KEY=123456789randomkey
###< league/oauth2-server-bundle ###

###> nelmio/cors-bundle ###
## Il suffit de mettre * pour accepter totalement le cross-domain.
## Ici, le serveur acceptera les requêtes de toutes les origines (de n'importe quel autre domaine)
## En prod, il faudra écrire une regex autorisant seulement certains sous-domaines.
CORS_ALLOW_ORIGIN='*'
###< nelmio/cors-bundle ###

```

Pour ``nelmio/cors``, il faudra sans doute aussi modifier cette conf dans ``config/packages/nelmio_cors.yaml`` :

```yaml
nelmio_cors:
    defaults:
        # Ce n'est pas fondamentalement utile de garder le mécanisme de pattern regex si on met "*" pour CORS_ALLOW_ORIGIN
        origin_regex: false
```


### 2- Configuration spécifique du serveur NGinx (c'est soit Nginx, soit Apache2)

``NGINX``

Il y a des paramètres à ajouter dans la conf située dans "/etc/nginx/sites-available/" (on suppose que le reste de la conf a été créée pour faire fonctionner un projet Symfony) :

```conf
	# Il faut augmenter le buffer, autrement l'erreur "502 Bad Gateway" survient
	fastcgi_split_path_info ^(.+\.php)(/.*)$;
	fastcgi_buffer_size 128k;
	fastcgi_buffers 4 256k;
	fastcgi_busy_buffers_size 256k;
```


``APACHE2``

```conf
<VirtualHost *:80>
    ServerName mon.domain.com
    DocumentRoot /path/to/symfony/project/public

    <Directory /path/to/symfony/project/public>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    <IfModule proxy_fcgi_module>
        <FilesMatch \.php$>
            # Choisir la version de PHP
            SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost"
        </FilesMatch>
    </IfModule>

    ErrorLog ${APACHE_LOG_DIR}/my-custom.error.log
    CustomLog ${APACHE_LOG_DIR}/my-custom.access.log combined
</VirtualHost>
```

## II- Création de l'entité de type "user" qui stockera les identifiants de connexion

```bash
php bin/console make:user
```

La console demandera quel champ sera l'identifiant, par exemple : username (ou email).
Cela créera automatiquement des paramètres dans le fichier "config/packages/security.yaml", dans la section "security.providers.app_user_provider.entity".
Dans la foulée, créer tous les champs de l'entity "User" (ou "Utilisateur"). Cette entité "User" sera le "provider" du système de sécurité et d'authentification.
C'est le système de base de Symfony et le bundle Oauth2 s'appuiera sur ça pour implémenter son système.


## III- Création des 4 tables préfixées "oauth2_" ("client", "access_token", "refresh_token")

Il suffit simplement de créer ou mettre à jour la structure (le schéma) de la base de données

```bash
php bin/console doctrine:schema:update --force
```

A ce stade, il ne devrait y avoir que les 4 tables Oauth2 + la table d'utilisateur.


## IV- Les fichiers de conf YAML

### 1- ``config/packages/security.yaml``

```yaml
security:
    providers:
        app_user_provider:
            entity:
                class: App\Entity\Utilisateur
                # Ici, on utilise le champ "username" comme identifiant
                property: username
	firewalls:
	    main:
	        access_token:
               # ATTENTION, ce fichier sera créé ultérieurement. C'est dans celui-ci que l'on va gérer le contrôle du token et la sécurité de manière globale.
               token_handler: App\Security\AccessTokenHandler
	    
        api:
            pattern: ^/api
            security: true
            stateless: true
            oauth2: true
    access_control:
        - { path: ^/api, roles: IS_AUTHENTICATED_FULLY }
```

### 2- ``config/services.yaml``

```yaml
services:
    # Il faut rendre public le repo utilisateur pour qu'il puisse être chargé comme argument dans la classe PasswordGrant (autowire). Autrement, ça ne marchera pas.
    App\Repository\UtilisateurRepository:
        class: App\Repository\UtilisateurRepository
        public: true
    
    App\Repository\AccessTokenRepository:
        class: App\Repository\AccessTokenRepository
        public: true

    League\OAuth2\Server\Grant\PasswordGrant:
        class: League\OAuth2\Server\Grant\PasswordGrant
        public: true
        arguments:
            # C'est ici qu'on explique à Symfony d'utiliser le custom user repo qui nous concerne.
            $userRepository: '@App\Repository\UtilisateurRepository'
    
    # ATTENTION, cette classe (et donc ce fichier) sera créée plus bas
    # On spécifie bien quel AccessTokenRepository injecter dans le construct.
    # Les classes AccessToken (entité) et AccessTokenRepository seront également créés plus bas.
    App\Security\AccessTokenHandler:
        class: App\Security\AccessTokenHandler
        public: true
        arguments:
            $accessTokenRepository: '@App\Repository\AccessTokenRepository'

```

## V- Créer les 3 fichiers ``src/Entity/AccessToken.php``, ``src/Repository/AccessTokenRepository.php`` et ``src/Security/AccessTokenHandler.php``

/!\ Un 4ème fichier ``src/Controller/ApiController.php``, super classe des controllers de l'API, peut être créé (c'est recommandé) afin de factoriser et de centraliser le processus de contrôle de l'access_token (dans le cas contraire, il faudrait injecter le service ``AccessTokenHandler`` dans tous les controllers pour récupérer le user authentifié).

### 1- ``src/Entity/AccessToken.php``

``ATTENTION`` : Ce fichier présente un conflit avec la pseudo classe d'entité "AccessToken" du bundle "league/oauth2-server". Lorsqu'on tente un ``php bin/console doctrine:schema:update --force``, doctrine indiquera que la table "oauth2_access_token" existe déjà.
La façon la plus simple pour contourner ce problème est de renommer temporairement le fichier "src/Entity/AccessToken.php" lorsqu'on tente un "update" du schéma de la base.
Il nous faut cependant intégrer dans notre projet une classe d'entité "AccessToken" reconnue comme une vraie classe d'entité Symfony (ce qui n'est pas le cas avec la classe originale "AccessToken" de league/oauth2), avec son propre "repository".

```php
<?php
namespace App\Entity;

use League\OAuth2\Server\Entities\AccessTokenEntityInterface;
use League\OAuth2\Server\Entities\Traits\AccessTokenTrait;
use League\OAuth2\Server\Entities\Traits\EntityTrait;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\AccessTokenRepository;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Entities\ScopeEntityInterface;

#[ORM\Entity(repositoryClass: AccessTokenRepository::class)]
#[ORM\Table(name: 'oauth2_access_token')]
class AccessToken implements AccessTokenEntityInterface
{
    use AccessTokenTrait, EntityTrait;

    // Par défaut, league n'indique pas de clé primaire, donc on le spécifie ici
    #[ORM\Id]
    #[ORM\Column(length: 80)]
    protected string $identifier;

    /**
     *
     * @var ScopeEntityInterface[]
     */
    protected array $scopes = [];

    
    #[ORM\Column(type: 'datetime_immutable', name: 'expiry')]
    protected \DateTimeImmutable $expiryDateTime;

    /**
     *
     * @var non-empty-string|null
     */
    #[ORM\Column(length: 128)]
    protected string|null $userIdentifier = null;

    protected ClientEntityInterface $client;

    /**
     * Associate a scope with the token.
     */
    public function addScope(ScopeEntityInterface $scope): void
    {
        $this->scopes[$scope->getIdentifier()] = $scope;
    }

    /**
     * Return an array of scopes associated with the token.
     *
     * @return ScopeEntityInterface[]
     */
    public function getScopes(): array
    {
        return array_values($this->scopes);
    }

    /**
     * Get the token's expiry date time.
     */
    public function getExpiryDateTime(): \DateTimeImmutable
    {
        return $this->expiryDateTime;
    }

    /**
     * Set the date time when the token expires.
     */
    public function setExpiryDateTime(\DateTimeImmutable $dateTime): void
    {
        $this->expiryDateTime = $dateTime;
    }

    /**
     * Set the identifier of the user associated with the token.
     *
     * @param non-empty-string $identifier
     *            The identifier of the user
     */
    public function setUserIdentifier(string $identifier): void
    {
        $this->userIdentifier = $identifier;
    }

    /**
     * Get the token user's identifier.
     *
     * @return non-empty-string|null
     */
    public function getUserIdentifier(): ?string
    {
        return $this->userIdentifier;
    }

    /**
     * Get the client that the token was issued to.
     */
    public function getClient(): ClientEntityInterface
    {
        return $this->client;
    }

    /**
     * Set the client that the token was issued to.
     */
    public function setClient(ClientEntityInterface $client): void
    {
        $this->client = $client;
    }
}

```

### 2- ``src/Repository/AccessTokenRepository.php``

```php
<?php
namespace App\Repository;

use League\OAuth2\Server\Entities\AccessTokenEntityInterface;
use League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface;
use App\Entity\AccessToken;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class AccessTokenRepository extends ServiceEntityRepository implements AccessTokenRepositoryInterface
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AccessToken::class);
    }

    /**
     *
     * {@inheritdoc}
     * @see \League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface::getNewToken()
     */
    public function getNewToken(ClientEntityInterface $clientEntity, array $scopes, $userIdentifier = null): AccessTokenEntityInterface
    {
        $accessToken = new AccessToken();
        $accessToken->setClient($clientEntity);
        $accessToken->setUserIdentifier($userIdentifier);
        foreach ($scopes as $scope) {
            $accessToken->addScope($scope);
        }
        return $accessToken;
    }

    /**
     *
     * {@inheritdoc}
     * @see \League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface::persistNewAccessToken()
     */
    public function persistNewAccessToken(AccessTokenEntityInterface $accessTokenEntity): void
    {
        $this->entityManager->persist($accessTokenEntity);
        $this->entityManager->flush();
    }

    /**
     *
     * {@inheritdoc}
     * @see \League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface::revokeAccessToken()
     */
    public function revokeAccessToken(string $tokenId): void
    {
        $token = $this->findOneBy($tokenId);
        if ($token instanceof AccessToken) {
            // Suppr access token
            $this->entityManager->remove($token);
            $this->entityManager->flush();
        }
    }

    /**
     *
     * {@inheritdoc}
     * @see \League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface::isAccessTokenRevoked()
     */
    public function isAccessTokenRevoked(string $tokenId): bool
    {
        $token = $this->findOneBy($tokenId);
        if (! $token instanceof AccessToken)
            return false;

        // Vérifier qu'expiry date n'espas dépassé
        $expiryTime = $token->getExpiryDateTime()?->getTimestamp();
        return ! $expiryTime || $expiryTime > time();
    }

    /**
     *
     * @param string $tokenId
     * @return AccessToken|NULL
     */
    public function findOneById(string $tokenId): ?AccessToken
    {
        return $this->findOneBy([
            'identifier' => $tokenId
        ]);
    }
}

```

### 3- ``src/Security/AccessTokenHandler.php``

Cette classe gère les requêtes sur l'API (sur tous les endpoints commençant par "/api") et la présence de l'access_token dans les headers de la requête. C'est dans cette classe que l'on va charger l'instance d'utilisateur authentifié.

```php
<?php
namespace App\Security;

use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use App\Repository\AccessTokenRepository;
use App\Entity\AccessToken;
use League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;

class AccessTokenHandler implements AccessTokenHandlerInterface
{

    private ?string $encryptionKey = null;

    private AccessTokenRepository $accessTokenRepository;

    private ?AccessToken $accessTokenEntity = null;

    private static ?UserBadge $userBadge;

    public function __construct(AccessTokenRepositoryInterface $accessTokenRepository)
    {
        $this->accessTokenRepository = $accessTokenRepository;
        $this->encryptionKey = $_ENV['OAUTH_ENCRYPTION_KEY'] ?? null;
    }

    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        // Pour décrypter le token JWT (et le faire correspondre à un identifier dans la table oauth2_access_token)
        $config = Configuration::forSymmetricSigner(new Sha256(), InMemory::plainText($this->encryptionKey));
        $token = $config->parser()->parse($accessToken);
        $identifier = $token->claims()->get('jti'); // 'jti' est l'identifier du token

        $this->accessTokenEntity = $this->accessTokenRepository->findOneById($identifier);
        if (! $this->accessTokenEntity?->getIdentifier()) {
            throw new BadCredentialsException('Invalid credentials.');
        }
        $userIdentifier = $this->accessTokenEntity->getUserIdentifier();

        // and return a UserBadge object containing the user identifier from the found token
        // (this is the same identifier used in Security configuration; it can be an email,
        // a UUID, a username, a database ID, etc.)
        static::$userBadge = new UserBadge($userIdentifier);
        return static::$userBadge;
    }

    public function getAccessTokenEntity(): ?AccessToken
    {
        return $this->accessTokenEntity;
    }

    public function getUserBadge(): ?UserBadge
    {
        return static::$userBadge;
    }
}
```

### 4- Eventuellement, créer une super classe abstraite de controller dont tous les autres controllers de l'API hériteront

Cette classe peut-être créée dans ``src/Controller/ApiController.php`` :

```php
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

```

Les propriétés de la classe ``ApiController`` sont déclarées ``protected``, ce qui signifie que les classes enfantes de ``ApiController`` pourront directement utiliser ``$this->authenticatedUser`` (instance d'utilisateur authentifié) et ``$this->accessTokenHandler`` (instance de ``AccessTokenHandler``, au cas où on souhaiterait l'utiliser dans les controllers).

``ATTENTION`` : Comme mentionné dans le commentaire du code PHP, la propriété ``$authenticatedUser`` n'est pas forcément chargée dans le cas d'un grant type "client_credentials".


## VI- Créer un "client" OAuth2

Ici, le terme "client" (API) désigne une instance du serveur Oauth2, car ce système peut gérer différents types de clients pouvant se connecter à l'API.
On doit définir un périmètre (ou un ou plusieurs "scopes") dans lequel le "client authentifié" (le navigateur ou un autre serveur distant faisant une requête à l'API) ne pourra évoluer que dans l'espace qui aura été défini.
Par exemple, je souhaite créer 2 "clients API" où le premier ne servira qu'à un autre serveur de faire des requêtes sur notre API, sans avoir besoin de s'authentifier
en tant que "user". Puis je vais créer un autre client mais accessible à une application web front qui aura une page de login où les utilisateurs vont cette fois-ci s'authentifier à partir de notre base "user" (précédemment créé).

De base, la création d'un "client API" se fait en console :

```bash
php bin/console league:oauth2-server:create-client -- [name] [identifier]
php bin/console league:oauth2-server:update-client --add-grant-type=client_credentials -- [identifier]
php bin/console league:oauth2-server:update-client --add-grant-type=password -- [identifier]
php bin/console league:oauth2-server:update-client --add-grant-type=refresh_token -- [identifier]
```

Lorsqu'on exécute la commande "php bin/console league:oauth2-server:create-client" pour créer un nouveau client, cela retourne le "client_id" et le "client_secret".

Le "grant_type" est ce qui va définir la manière dont l'application tierce (la webapp front ou toute autre chose qui fait la requête à l'API) va devoir s'authentifier pour recevoir un "access_token" (un jeton de sécurité qui authentifie et identifie ce "client").

Il y a plusieurs types de "grant_type", mais les 2 principalement utilisés sont "client_credentials" et "password" (et optionnellement, le "refresh_token").

Le "client_credentials" est le système le moins restrictif car il s'appuie uniquement sur les "credentials" donnés par le client API : "client_id" et "client_secret".
C'est typiquement le "grant_type" que l'on utilise pour permettre à une application tierce qui s'exécute en console sur un autre serveur distant de faire des requêtes sur notre API. Ici, il ne s'agit de "connecter" un "user", mais simplement de permettre à des applications en tâches de fond de faire des requêtes.


``Exemple 1 :``
Je crée le client de type "client_credentials" en console côté serveur :

```bash
php bin/console league:oauth2-server:create-client -- dummy backend_routines
php bin/console league:oauth2-server:update-client --add-grant-type=client_credentials -- backend_routines

```

Ici, j'ai créé un client dont le "client_id" est "backend_routines". Le "client_secret" est généré par le bundle Oauth2 et est retourné dans la console, mais toutes ces données sont lisibles dans la table "oauth2_client".
Dans l'application tierce qui souhaite se connecter à l'API, la demande d'authentification se fera sur l'URI "/token", en passant en paramètres "POST" :

```json
{
    client_id: "backend_routines",
    client_secret: "une.chaine.compliquée.générée.et.fournie.par.le.bundle.oauth2",
    grant_type: "client_credentials"
}
```

Si l'authentification est bonne, le serveur retournera un JSON sur ce format :

```json
{
    access_token: "une.chaine.encore.plus.compliquée.qui.cette.fois.est.le.jeton.de.sécurité.et.d'accès", // Il faudra passer ce token dans les "headers" des futures requêtes
    token_type: "Bearer", // C'est soit "Basic", soit "Bearer", mais le plus costaux, c'est "Bearer"
    expires: 3600, // Expire dans une heure
    refresh_token: "une.chaine.équivalente.à.access_token" // ce refresh token sert si le "client API" autorise le grant_type "refresh_token"
}
```

Il est clair ici que ce type de "client API" ne doit pas être utilisée pour une application web, avec des credentials stockées dans un code JS.


Pour cela, il y a plutôt le grant_type "password" où l'on demande à un utilisateur de s'authentifier.

``Exemple 2 :``

Je crée le client de type "password" en console côté serveur :

```bash
php bin/console league:oauth2-server:create-client -- dummy front_application
php bin/console league:oauth2-server:update-client --add-grant-type=password -- front_application
php bin/console league:oauth2-server:update-client --add-grant-type=refresh_token -- front_application

```

Ici, j'ai aussi créé le grant_type "refresh_token" car il est usuel de pouvoir rafraîchir son "access_token" par ce type de réauthentification.
Côté Javascript, il sera possible de stocker les "client_id" et "client_secret" car ils ne seront pas suffisants pour recevoir un "access_token".
Le type "password" permet à notre API d'authentifier et d'identifier l'utilisateur en chargeant ses données.

En JQuery, l'appel AJAX se fera de cette manière :

```javascript
$.ajax({
    url: "https://domain.com/token",
    method: "POST",
    data: {
        client_id: "front_application",
        client_secret: "...",
        grant_type: "password",
        username: "john@doe.us",
        password: "mypassword"
    },
    success: (response)=>{
        // Faire quelque chose avec la réponse, qui est la même pour tous les types de grant_type
        let access_token = response.access_token;
        let refresh_token = response.refresh_token;
        let token_type = response.token_type;
        let token_time_to_live = response.expires;
    }
});
```

Pour rappel, si la configuration a bien été suivie, faire une requête sur le endpoint "/token" est déjà possible et devrait déjà marcher avant même d'avoir créé les 4 fichiers PHP "custom" et les conf YAML. 
Par contre, les 4 fichiers PHP sont nécessaires pour gérer les requêtes sur l'API nécessitant l'access_token dans les headers des requêtes.

"/token" est un endpoint public et c'est ce qui correspond à une page de login.
Mais tous les endpoints commençant par "/api" requiert qu'il y ait un access_token qui est en quelque sorte l'ID de session (mais le système OAuth2 n'ouvre pas de session PHP, c'est un système qui s'applique à n'importe quel langage de programmation).

Avec JQuery, par exemple, une requête sur le endpoint ``GET /api/utilisateur`` se fera de cette manière :

```javascript
$.ajax({
	url: "https://mon.domaine.fr/api/utilisateur",
	method: "get",
	headers: {
		"Authorization": token_type + ' ' + access_token	// sachant que "token_type" est le plus souvent "Bearer"
	},
	data: {id: user_id}, // c'est à titre d'exemple, il n'y a pas forcément de data à passer
	success: (response) => {
		// Do something
	}
});
```
