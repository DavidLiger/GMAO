<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class LocPointMesureTypeBienDto
{
    public function __construct(
        #[Assert\NotBlank]
        public int     $locPointMesureId,

        #[Assert\NotBlank]
        public int     $typeBienId,

        public ?string $valeurDefaut,
    )
    {
    }
}