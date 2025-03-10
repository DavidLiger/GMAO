<?php

namespace App\Repository;

use App\Entity\AccessToken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use League\OAuth2\Server\Entities\AccessTokenEntityInterface;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface;

class AccessTokenRepository extends ServiceEntityRepository implements AccessTokenRepositoryInterface
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AccessToken::class);
    }

    /**
     *
     * {@inheritdoc}
     * @see AccessTokenRepositoryInterface::getNewToken
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
     * @see AccessTokenRepositoryInterface::persistNewAccessToken
     */
    public function persistNewAccessToken(AccessTokenEntityInterface $accessTokenEntity): void
    {
        $this->entityManager->persist($accessTokenEntity);
        $this->entityManager->flush();
    }

    /**
     *
     * {@inheritdoc}
     * @see AccessTokenRepositoryInterface::revokeAccessToken
     */
    public function revokeAccessToken(string $tokenId): void
    {
        $token = $this->findOneById($tokenId);
        if ($token instanceof AccessToken) {
            // Suppr access token
            $this->entityManager->remove($token);
            $this->entityManager->flush();
        }
    }


    /**
     *
     * {@inheritdoc}
     * @see AccessTokenRepositoryInterface::isAccessTokenRevoked
     */
    public function isAccessTokenRevoked(string $tokenId): bool
    {
        $token = $this->findOneById($tokenId);
        if (!$token instanceof AccessToken)
            return false;

        // Vérifier qu'expiry date n'espas dépassé
        $expiryTime = $token->getExpiryDateTime()?->getTimestamp();
        return !$expiryTime || $expiryTime > time();
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