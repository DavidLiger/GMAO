<?php

namespace App\Security;

use App\Entity\AccessToken;
use App\Repository\AccessTokenRepository;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class AccessTokenHandler implements AccessTokenHandlerInterface
{

    private static ?UserBadge $userBadge = null;
    private ?string $encryptionKey;
    private AccessTokenRepository $accessTokenRepository;
    private ?AccessToken $accessTokenEntity = null;

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
        if (!$this->accessTokenEntity?->getIdentifier()) {
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