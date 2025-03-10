<?php

namespace App\Repository;

use App\Entity\Criticite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class CriticiteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Criticite::class);
    }

    // Méthode pour créer une criticité
    public function create(Criticite $criticite): void
    {
        $entityManager = $this->getEntityManager();
        $entityManager->persist($criticite);
        $entityManager->flush();
    }

    // Méthode pour supprimer une criticité
    public function delete(Criticite $criticite): void
    {
        $entityManager = $this->getEntityManager();
        $entityManager->remove($criticite);
        $entityManager->flush();
    }

    // Méthode pour trouver une criticité par son ID
    public function find($id, $lockMode = null, $lockVersion = null): ?Criticite
    {
        return parent::find($id, $lockMode, $lockVersion);
    }

    // Méthode pour trouver une criticité par des critères spécifiques
    public function findOneBy(array $criteria, array $orderBy = null): ?Criticite
    {
        return parent::findOneBy($criteria, $orderBy);
    }

    // Méthode pour trouver toutes les criticités
    public function findAll(): array
    {
        return parent::findAll();
    }

    // Méthode pour trouver des criticités par des critères spécifiques
    // public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null): array
    // {
    //     return parent::findBy($criteria, $orderBy, $limit, $offset);
    // }

    // Méthode pour trouver les actions associées à une criticité spécifique
    public function findActionsByCriticiteId(int $criticiteId): array
    {
        return $this->createQueryBuilder('c')
            ->innerJoin('c.actions', 'a')
            ->addSelect('a')
            ->where('c.id = :criticiteId')
            ->setParameter('criticiteId', $criticiteId)
            ->getQuery()
            ->getResult();
    }
}