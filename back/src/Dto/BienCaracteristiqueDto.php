<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class BienCaracteristiqueDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string $value,

        #[Assert\NotBlank]
        public int    $caracteristiqueId,

        public int    $priorite,


    )
    {
    }
}