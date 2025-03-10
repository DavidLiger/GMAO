<?php

namespace App\Repository;

use App\Entity\TypeAction;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TypeActionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TypeAction::class);
    }

    // Méthode pour créer un TypeAction
    public function create(TypeAction $typeAction): void
    {
        $entityManager = $this->getEntityManager(); // Utilisez getEntityManager() pour obtenir l'EntityManager
        $entityManager->persist($typeAction);
        $entityManager->flush();
    }

    // Méthode pour supprimer un TypeAction
    public function delete(TypeAction $typeAction): void
    {
        $entityManager = $this->getEntityManager(); // Utilisez getEntityManager() pour obtenir l'EntityManager
        $entityManager->remove($typeAction);
        $entityManager->flush();
    }

    // Méthode pour trouver un TypeAction par son ID
    public function find($id, $lockMode = null, $lockVersion = null): ?TypeAction
    {
        return parent::find($id, $lockMode, $lockVersion);
    }

    // Méthode pour trouver un TypeAction par des critères spécifiques
    public function findOneBy(array $criteria, array $orderBy = null): ?TypeAction
    {
        return parent::findOneBy($criteria, $orderBy);
    }

    // Méthode pour trouver tous les TypeAction
    public function findAll(): array
    {
        return parent::findAll();
    }

    // Méthode pour trouver des TypeAction par des critères spécifiques
    public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null): array
    {
        return parent::findBy($criteria, $orderBy, $limit, $offset);
    }

    // Méthode pour récupérer tous les TypeAction par societe_id
    public function findAllTypeActions(?int $societe_id = null): array
    {
        $qb = $this->createQueryBuilder('t')
            ->andWhere('t.typeActionParent IS NULL');

        if ($societe_id !== null) {
            $qb->andWhere('t.societe = :societe_id')
            ->setParameter('societe_id', $societe_id);
        }

        return $qb->getQuery()->getResult();
    }

    // Méthode pour récupérer tous les SousTypeAction (avec parent)
    public function findAllSousTypeActions(): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.typeActionParent IS NOT NULL')
            ->getQuery()
            ->getResult();
    }
}