<?php

namespace App\Repository;

use App\Entity\TypeBien;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TypeBien>
 */
class TypeBienRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TypeBien::class);
    }
    
    public function create(TypeBien $typeBien): void
    {
        $this->getEntityManager()->persist($typeBien);
        $this->getEntityManager()->flush();
    }

    public function delete(TypeBien $typeBien): void
    {
        $this->getEntityManager()->remove($typeBien);
        $this->getEntityManager()->flush();
    }
    
    public function update(): void
    {
        $this->getEntityManager()->flush();
    }
}
