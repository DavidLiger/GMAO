<?php

namespace App\Repository;

use App\Entity\Utilisateur;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Entities\UserEntityInterface;
use League\OAuth2\Server\Repositories\UserRepositoryInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 *
 * @extends ServiceEntityRepository<Utilisateur>
 */
class UtilisateurRepository extends ServiceEntityRepository implements PasswordUpgraderInterface, UserRepositoryInterface
{

    private UserPasswordHasherInterface $PassworHasher;

    public function __construct(ManagerRegistry $registry, UserPasswordHasherInterface $PassworHasher)
    {
        parent::__construct($registry, Utilisateur::class);
        $this->PassworHasher = $PassworHasher;
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof Utilisateur)
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));

        $this->getEntityManager()->persist($user->setPassword($newHashedPassword));
        $this->getEntityManager()->flush();
    }

    /**
     *
     * {@inheritdoc}
     * @param string $username
     * @param string $password
     * @param string $grantType
     * @param ClientEntityInterface $clientEntity
     * @return UserEntityInterface|NULL
     * @see UserRepositoryInterface::getUserEntityByUserCredentials
     *
     */
    public function getUserEntityByUserCredentials(string $username, string $password, string $grantType, ClientEntityInterface $clientEntity): ?UserEntityInterface
    {
        $user = $this->findOneBy([
            'username' => $username
        ]);
        if ($user instanceof Utilisateur && $this->PassworHasher->isPasswordValid($user, $password))
            return $user;

        return null;
    }

    public function create(Utilisateur $utilisateur): void
    {
        $this->getEntityManager()->persist($utilisateur);
        $this->getEntityManager()->flush();
    }

    public function delete(Utilisateur $utilisateur): void
    {
        $this->getEntityManager()->remove($utilisateur);
        $this->getEntityManager()->flush();
    }

    public function update(): void
    {
        $this->getEntityManager()->flush();
    }
}
