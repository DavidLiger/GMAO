<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class UpdateBienDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string  $nom,
        public ?string $description,
        public ?string $image


    )
    {
    }
}