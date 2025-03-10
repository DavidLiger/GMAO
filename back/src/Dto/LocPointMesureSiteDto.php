<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class LocPointMesureSiteDto
{
    public function __construct(
        #[Assert\NotBlank]
        public int     $locPointMesureId,

        #[Assert\NotBlank]
        public int     $siteId,

        #[Assert\NotBlank]
        public string  $numeroPointMesure,

        public ?string $description,
    )
    {
    }
}