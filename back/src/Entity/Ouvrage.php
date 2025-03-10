<?php

namespace App\Entity;

use App\Repository\OuvrageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: OuvrageRepository::class)]
class Ouvrage extends Bien
{
    #[Groups('defaultOuvrage')]
    #[ORM\ManyToOne(inversedBy: 'ouvrages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Site $site = null;

    #[ORM\Column]
    #[Groups(['defaultOuvrage', 'minimal'])]
    private ?int $position = null;

    /**
     * @var Collection<int, Equipement>
     */
    #[ORM\OneToMany(targetEntity: Equipement::class, mappedBy: 'ouvrage')]
    #[Groups(['defaultBien'])]
    private Collection $equipements;

    public function __construct()
    {
        parent::__construct();
        $this->equipements = new ArrayCollection();
    }

    public function getSite(): ?Site
    {
        return $this->site;
    }

    public function setSite(?Site $site): static
    {
        $this->site = $site;

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;

        return $this;
    }

    /**
     * @return Collection<int, Equipement>
     */
    public function getEquipements(): Collection
    {
        return $this->equipements;
    }

    public function addEquipement(Equipement $equipement): static
    {
        if (!$this->equipements->contains($equipement)) {
            $this->equipements->add($equipement);
            $equipement->setOuvrage($this);
        }

        return $this;
    }

    public function removeEquipement(Equipement $equipement): static
    {
        if ($this->equipements->removeElement($equipement)) {
            // set the owning side to null (unless already changed)
            if ($equipement->getOuvrage() === $this) {
                $equipement->setOuvrage(null);
            }
        }

        return $this;
    }

    public function getBreadcrumbs(): array
    {
        return array_merge(
            [['nom' => $this->getSite()->getNom(), 'id' => $this->getSite()->getId()]],
            parent::getBreadcrumbs(),
        );
    }

    public function getChildren(): Collection
    {
        return $this->getEquipements();
    }
}
