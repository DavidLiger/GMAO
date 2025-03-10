<?php

namespace App\Repository;

use App\Entity\EquipeUtilisateur;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EquipeUtilisateur>
 */
class EquipeUtilisateurRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EquipeUtilisateur::class);
    }

    //    /**
    //     * @return EquipeUtilisateur[] Returns an array of EquipeUtilisateur objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('e')
    //            ->andWhere('e.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('e.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?EquipeUtilisateur
    //    {
    //        return $this->createQueryBuilder('e')
    //            ->andWhere('e.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function create(EquipeUtilisateur $equipeUtilisateur): void
    {
        $this->getEntityManager()->persist($equipeUtilisateur);
        $this->getEntityManager()->flush();
    }

    public function delete(EquipeUtilisateur $equipeUtilisateur): void
    {
        $this->getEntityManager()->remove($equipeUtilisateur);
        $this->getEntityManager()->flush();
    }

    public function update(): void
    {
        $this->getEntityManager()->flush();
    }
}
