<?php

namespace App\Entity;

use App\Repository\UniteRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: UniteRepository::class)]
class Unite
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['defaultUnite', "defaultCaracteristique"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['defaultUnite', 'defaultCaracteristique', 'minimalCaracteristique', 'bienCarac', 'defaultCaracteristiqueTypeBien'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['defaultUnite', 'bienCarac', 'defaultCaracteristique', 'defaultCaracteristiqueTypeBien'])]
    private ?string $libelle = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups('defaultUnite')]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $codeSandre = null;

    #[ORM\Column]
    private ?bool $isGmao = null;

    #[ORM\Column]
    private ?bool $isData = null;

    #[ORM\Column]
    private ?bool $isSandre = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): static
    {
        $this->libelle = $libelle;

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

    public function getCodeSandre(): ?int
    {
        return $this->codeSandre;
    }

    public function setCodeSandre(?int $codeSandre): static
    {
        $this->codeSandre = $codeSandre;

        return $this;
    }

    public function isGmao(): ?bool
    {
        return $this->isGmao;
    }

    public function setGmao(bool $isGmao): static
    {
        $this->isGmao = $isGmao;

        return $this;
    }

    public function isData(): ?bool
    {
        return $this->isData;
    }

    public function setData(bool $isData): static
    {
        $this->isData = $isData;

        return $this;
    }

    public function isSandre(): ?bool
    {
        return $this->isSandre;
    }

    public function setSandre(bool $isSandre): static
    {
        $this->isSandre = $isSandre;

        return $this;
    }

}
