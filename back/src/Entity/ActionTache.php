<?php

namespace App\Entity;

use App\Repository\ActionTacheRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ActionTacheRepository::class)]
class ActionTache
{

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'taches')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Action $action = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Tache $tache = null;

    #[ORM\Column(nullable: true)]
    private ?bool $effectuee = null;

    #[ORM\Column(length: 1024, nullable: true)]
    private ?string $commentaire = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $date_DerniereModif = null;

    public function getAction(): ?Action
    {
        return $this->action;
    }

    public function setAction(?Action $action): static
    {
        $this->action = $action;

        return $this;
    }

    public function getTache(): ?Tache
    {
        return $this->tache;
    }

    public function setTache(?Tache $tache): static
    {
        $this->tache = $tache;

        return $this;
    }

    public function isEffectuee(): ?bool
    {
        return $this->effectuee;
    }

    public function setEffectuee(?bool $effectuee): static
    {
        $this->effectuee = $effectuee;

        return $this;
    }

    public function getCommentaire(): ?string
    {
        return $this->commentaire;
    }

    public function setCommentaire(?string $commentaire): static
    {
        $this->commentaire = $commentaire;

        return $this;
    }

    public function getDateDerniereModif(): ?DateTimeInterface
    {
        return $this->date_DerniereModif;
    }

    public function setDateDerniereModif(?DateTimeInterface $date_DerniereModif): static
    {
        $this->date_DerniereModif = $date_DerniereModif;

        return $this;
    }
}
