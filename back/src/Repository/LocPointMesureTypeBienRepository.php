<?php

namespace App\Repository;

use App\Entity\LocPointMesureTypeBien;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<LocPointMesureTypeBien>
 */
class LocPointMesureTypeBienRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, LocPointMesureTypeBien::class);
    }

    //    /**
    //     * @return LocPointMesureTypeBien[] Returns an array of LocPointMesureTypeBien objects
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

    //    public function findOneBySomeField($value): ?LocPointMesureTypeBien
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function create(LocPointMesureTypeBien $locPointMesureTypeBien): void
    {
        $this->getEntityManager()->persist($locPointMesureTypeBien);
        $this->getEntityManager()->flush();
    }

    public function delete(LocPointMesureTypeBien $locPointMesureTypeBien): void
    {
        $this->getEntityManager()->remove($locPointMesureTypeBien);
        $this->getEntityManager()->flush();
    }

    public function update(): void
    {
        $this->getEntityManager()->flush();
    }
}
