<?php

namespace App\Dto;

use App\Library\Enum\EnumNatureBien;
use Symfony\Component\Validator\Constraints as Assert;

readonly class TypeBienDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string         $nom,

        #[Assert\NotBlank]
        #[Assert\Type(type: EnumNatureBien::class)]
        public EnumNatureBien $nature,

        public ?array        $arbo = null, // Ajout du champ arbo
    )
    {
    }
}