<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

readonly class TypeActionDto
{
    public function __construct(
        #[Assert\NotBlank(message: "Le nom est requis.")]
        #[Assert\Type(type: "string", message: "Le nom doit être une chaîne de caractères.")]
        public string $nom,
        
        #[Assert\NotBlank(message: "L'identifiant de la société est requis.")] 
        #[Assert\Type(type: "int", message: "L'identifiant de la société doit être un entier.")]
        public int $idSociete,
 
        #[Assert\Type(type: "int", message: "L'identifiant du type parent doit être un entier.")]
        public ?int $idTypeActionParent = null, // Optionnel, pour les sous-types

        #[Assert\Regex(pattern: '/^bg-(red|sky|green|yellow|blue|purple|cyan|black|white|orange)(-[0-9]{3})?$/', message: 'Invalid color format')]
        public ?string $color = null,

    ) {
    }
}