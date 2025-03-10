<?php

namespace App\Entity;

use App\Repository\LocPointMesureRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: LocPointMesureRepository::class)]
class LocPointMesure
{

    #[ORM\Id]
    #[ORM\Column(length: 5)]
    #[Groups(['defaultPointMesure', 'defaultPointMesureSite', 'defaultPointMesureTypeBien'])]
    private ?string $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['defaultPointMesure', 'defaultPointMesureSite', 'defaultPointMesureTypeBien'])]
    private ?string $description = null;

    /**
     * @var Collection<int, LocPointMesureSite>
     */
    #[ORM\OneToMany(targetEntity: LocPointMesureSite::class, mappedBy: 'locPointMesureId', orphanRemoval: true)]
    private Collection $locPointMesureSites;

    #[ORM\Column(length: 255)]
    #[Groups(['defaultPointMesure', 'defaultPointMesureSite', 'defaultPointMesureTypeBien'])]
    private ?string $nom = null;

    /**
     * @var Collection<int, LocPointMesureTypeBien>
     */
    #[ORM\OneToMany(targetEntity: LocPointMesureTypeBien::class, mappedBy: 'locPointMesure', orphanRemoval: true)]
    private Collection $locPointMesureTypeBiens;


    public function __construct()
    {
        $this->locPointMesureSites = new ArrayCollection();
        $this->locPointMesureTypeBiens = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }


    public function setId(string $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, LocPointMesureSite>
     */
    public function getLocPointMesureSites(): Collection
    {
        return $this->locPointMesureSites;
    }

    public function addLocPointMesureSite(LocPointMesureSite $locPointMesureSite): static
    {
        if (!$this->locPointMesureSites->contains($locPointMesureSite)) {
            $this->locPointMesureSites->add($locPointMesureSite);
            $locPointMesureSite->setLocPointMesureId($this);
        }

        return $this;
    }

    public function removeLocPointMesureSite(LocPointMesureSite $locPointMesureSite): static
    {
        if ($this->locPointMesureSites->removeElement($locPointMesureSite)) {
            // set the owning side to null (unless already changed)
            if ($locPointMesureSite->getLocPointMesureId() === $this) {
                $locPointMesureSite->setLocPointMesureId(null);
            }
        }

        return $this;
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

    /**
     * @return Collection<int, LocPointMesureTypeBien>
     */
    public function getLocPointMesureTypeBiens(): Collection
    {
        return $this->locPointMesureTypeBiens;
    }

    public function addLocPointMesureTypeBien(LocPointMesureTypeBien $locPointMesureTypeBien): static
    {
        if (!$this->locPointMesureTypeBiens->contains($locPointMesureTypeBien)) {
            $this->locPointMesureTypeBiens->add($locPointMesureTypeBien);
            $locPointMesureTypeBien->setLocPointMesure($this);
        }

        return $this;
    }

    public function removeLocPointMesureTypeBien(LocPointMesureTypeBien $locPointMesureTypeBien): static
    {
        if ($this->locPointMesureTypeBiens->removeElement($locPointMesureTypeBien)) {
            // set the owning side to null (unless already changed)
            if ($locPointMesureTypeBien->getLocPointMesure() === $this) {
                $locPointMesureTypeBien->setLocPointMesure(null);
            }
        }

        return $this;
    }
}
