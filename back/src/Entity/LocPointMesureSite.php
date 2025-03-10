<?php

namespace App\Entity;

use App\Repository\LocPointMesureSiteRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: LocPointMesureSiteRepository::class)]
class LocPointMesureSite
{

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'locPointMesureSites')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Site $site = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'locPointMesureSites')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups('defaultPointMesureSite')]
    private ?LocPointMesure $locPointMesure = null;

    #[ORM\Column(length: 255)]
    #[Groups(['defaultPointMesureSite'])]
    private ?string $numeroPointMesure = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['defaultPointMesureSite'])]
    private ?string $description = null;

    public function getSiteId(): ?Site
    {
        return $this->site;
    }

    public function setSiteId(?Site $site): static
    {
        $this->site = $site;

        return $this;
    }

    public function getLocPointMesureId(): ?LocPointMesure
    {
        return $this->locPointMesure;
    }

    public function setLocPointMesureId(?LocPointMesure $locPointMesure): static
    {
        $this->locPointMesure = $locPointMesure;

        return $this;
    }

    public function getNumeroPointMesure(): ?string
    {
        return $this->numeroPointMesure;
    }

    public function setNumeroPointMesure(string $numeroPointMesure): static
    {
        $this->numeroPointMesure = $numeroPointMesure;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }
}
