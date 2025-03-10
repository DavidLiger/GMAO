<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class EquipementDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string  $nom,

        public bool    $relevable,

        #[Assert\NotBlank]
        public int     $typeBienId,

        #[Assert\NotBlank]
        public int     $siteId,

        #[Assert\NotBlank]
        public ?int    $ouvrageId,
        public ?string $description,
        public ?string $image


    )
    {
    }
}