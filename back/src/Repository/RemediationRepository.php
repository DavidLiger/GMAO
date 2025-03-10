<?php

namespace App\Repository;

use App\Entity\Remediation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class RemediationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Remediation::class);
    }

    // Méthode pour créer une remédiation
    public function create(Remediation $remediation): void
    {
        $entityManager = $this->getEntityManager(); // Utilisez getEntityManager() pour obtenir l'EntityManager
        $entityManager->persist($remediation);
        $entityManager->flush();
    }

    // Méthode pour supprimer une remédiation
    public function delete(Remediation $remediation): void
    {
        $entityManager = $this->getEntityManager(); // Utilisez getEntityManager() pour obtenir l'EntityManager
        $entityManager->remove($remediation);
        $entityManager->flush();
    }

    // Méthode pour trouver une remédiation par son ID
    public function find($id, $lockMode = null, $lockVersion = null): ?Remediation
    {
        return parent::find($id, $lockMode, $lockVersion);
    }

    // Méthode pour trouver une remédiation par des critères spécifiques
    public function findOneBy(array $criteria, array $orderBy = null): ?Remediation
    {
        return parent::findOneBy($criteria, $orderBy);
    }

    // Méthode pour trouver toutes les remédiations
    public function findAll(): array
    {
        return parent::findAll();
    }

    // Méthode pour trouver des remédiations par des critères spécifiques
    // public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null): array
    // {
    //     return parent::findBy($criteria, $orderBy, $limit, $offset);
    // }

    // Méthode pour trouver les actions associées à une remédiation spécifique
    public function findActionsByRemediationId(int $remediationId): array
    {
        return $this->createQueryBuilder('r')
            ->innerJoin('r.actions', 'a')
            ->addSelect('a')
            ->where('r.id = :remediationId')
            ->setParameter('remediationId', $remediationId)
            ->getQuery()
            ->getResult();
    }
}