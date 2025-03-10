<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class MemberDto
{
    #[Assert\NotBlank]
    #[Assert\Type("integer")]
    public int $id;
}