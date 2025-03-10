<?php

namespace App\Repository;

use App\Entity\LocPointMesureSite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<LocPointMesureSite>
 */
class LocPointMesureSiteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, LocPointMesureSite::class);
    }

    //    /**
    //     * @return LocPointMesureSite[] Returns an array of LocPointMesureSite objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('l.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?LocPointMesureSite
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function create(LocPointMesureSite $locPointMesureSite): void
    {
        $this->getEntityManager()->persist($locPointMesureSite);
        $this->getEntityManager()->flush();
    }

    public function delete(LocPointMesureSite $locPointMesureSite): void
    {
        $this->getEntityManager()->remove($locPointMesureSite);
        $this->getEntityManager()->flush();
    }

    public function update(): void
    {
        $this->getEntityManager()->flush();
    }
}
