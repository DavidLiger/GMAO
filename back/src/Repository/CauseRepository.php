<?php

namespace App\Repository;

use App\Entity\Cause;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class CauseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Cause::class);
    }

    // Ajoutez cette méthode pour créer une cause
    // Méthode pour créer une cause
    public function create(Cause $cause): void
    {
        $entityManager = $this->getEntityManager(); // Utilisez getEntityManager() pour obtenir l'EntityManager
        $entityManager->persist($cause);
        $entityManager->flush();
    }

    // Méthode pour supprimer une cause
    public function delete(Cause $cause): void
    {
        $entityManager = $this->getEntityManager(); // Utilisez getEntityManager() pour obtenir l'EntityManager
        $entityManager->remove($cause);
        $entityManager->flush();
    }

    // Méthode pour trouver une cause par son ID
    public function find($id, $lockMode = null, $lockVersion = null): ?Cause
    {
        return parent::find($id, $lockMode, $lockVersion);
    }

    // Méthode pour trouver une cause par des critères spécifiques
    public function findOneBy(array $criteria, array $orderBy = null): ?Cause
    {
        return parent::findOneBy($criteria, $orderBy);
    }

    // Méthode pour trouver toutes les causes
    public function findAll(): array
    {
        return parent::findAll();
    }

    // Méthode pour trouver des causes par des critères spécifiques
    // public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null): array
    // {
    //     return parent::findBy($criteria, $orderBy, $limit, $offset);
    // }

    // Méthode pour trouver les actions associées à une cause spécifique
    public function findActionsByCauseId(int $causeId): array
    {
        return $this->createQueryBuilder('c')
            ->innerJoin('c.actions', 'a')
            ->addSelect('a')
            ->where('c.id = :causeId')
            ->setParameter('causeId', $causeId)
            ->getQuery()
            ->getResult();
    }
}