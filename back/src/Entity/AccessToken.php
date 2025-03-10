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
#[ORM\Table(name: 'oauth2_access_token', options: ["skip" => true])]
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