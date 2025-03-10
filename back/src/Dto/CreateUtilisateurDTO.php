<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CreateUtilisateurDTO
{

    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(max: 180)]
        public ?string $username = null,

        #[Assert\NotBlank]
        #[Assert\Length(max: 100)]
        public ?string $prenom = null,

        #[Assert\NotBlank]
        #[Assert\Length(max: 100)]
        public ?string $nom = null,

        #[Assert\NotBlank]
        #[Assert\Email]
        public ?string $email = null,

        #[Assert\Length(max: 16)]
        public ?string $tel1 = null,

        #[Assert\Length(max: 16)]
        public ?string $tel2 = null,

        #[Assert\Type('bool')]
        public ?bool   $acces_gmao = null,

        #[Assert\Type('bool')]
        public ?bool   $acces_data = null,

        #[Assert\Type('bool')]
        public ?bool   $acces_spa = null,

        #[Assert\Type('bool')]
        public ?bool   $acces_sandre = null)
    {
    }
}
