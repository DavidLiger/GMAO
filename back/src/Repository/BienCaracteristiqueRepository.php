<?php

namespace App\Repository;

use App\Entity\BienCaracteristique;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<BienCaracteristique>
 */
class BienCaracteristiqueRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BienCaracteristique::class);
    }

    //    /**
    //     * @return BienCaracteristique[] Returns an array of BienCaracteristique objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('b.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?BienCaracteristique
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function create(BienCaracteristique $bienCaracteristique): void
    {
        $this->getEntityManager()->persist($bienCaracteristique);
        $this->getEntityManager()->flush();
    }

    public function persist(BienCaracteristique $bienCaracteristique): void
    {
        $this->getEntityManager()->persist($bienCaracteristique);
    }

    public function delete(BienCaracteristique $bienCaracteristique): void
    {
        $this->getEntityManager()->remove($bienCaracteristique);
        $this->getEntityManager()->flush();
    }

    public function update(): void
    {
        $this->getEntityManager()->flush();
    }
}
