<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class EquipeDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(max: 255)]
        public string  $nom,

        public ?string $label,

        public ?int    $responsable,

        #[Assert\NotBlank]
        #[Assert\Regex(pattern: '/^bg-(red|sky|green|yellow|blue|purple|cyan|black|white|orange)(-[0-9]{3})?$/', message: 'Invalid color format')]
        public string  $color,

        /**
         * @var array<int>
         */
        #[Assert\Valid]
        #[Assert\NotBlank]
        public array   $membres = []
    )
    {
    }
}
