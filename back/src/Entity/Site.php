<?php

namespace App\Entity;

use App\Repository\SiteRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: SiteRepository::class)]
class Site extends Bien
{
    #[ORM\Column(type: "decimal", precision: 12, scale: 9, nullable: true)]
    #[Groups(['defaultBien', 'defaultSite'])]
    private ?float $latitude = null;

    #[ORM\Column(type: "decimal", precision: 12, scale: 9, nullable: true)]
    #[Groups(['defaultBien', 'defaultSite'])]
    private ?float $longitude = null;

    #[ORM\ManyToOne]
    #[Groups(['defaultSite', 'defaultBien'])]
    private ?Ville $ville = null;

    /**
     * @var Collection<int, Ouvrage>
     */
    #[ORM\OneToMany(targetEntity: Ouvrage::class, mappedBy: 'site')]
    #[Groups(['defaultBien'])]
    private Collection $ouvrages;

    /**
     * @var Collection<int, Equipement>
     */
    #[ORM\OneToMany(targetEntity: Equipement::class, mappedBy: 'site')]
    #[Groups(['defaultBien'])]
    private Collection $equipements;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?DateTimeInterface $dateArchive = null;

    /**
     * @var Collection<int, LocPointMesureSite>
     */
    #[ORM\OneToMany(targetEntity: LocPointMesureSite::class, mappedBy: 'site', orphanRemoval: true)]
    private Collection $locPointMesureSites;

    public function __construct()
    {
        parent::__construct();
        $this->ouvrages = new ArrayCollection();
        $this->equipements = new ArrayCollection();
        $this->locPointMesureSites = new ArrayCollection();
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(?float $latitude): static
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(?float $longitude): static
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getVille(): ?Ville
    {
        return $this->ville;
    }

    public function setVille(?Ville $ville): static
    {
        $this->ville = $ville;

        return $this;
    }

    /**
     * @return Collection<int, Ouvrage>
     */
    public function getOuvrages(): Collection
    {
        return $this->ouvrages;
    }

    public function addOuvrage(Ouvrage $ouvrage): static
    {
        if (!$this->ouvrages->contains($ouvrage)) {
            $this->ouvrages->add($ouvrage);
            $ouvrage->setSite($this);
        }

        return $this;
    }

    public function removeOuvrage(Ouvrage $ouvrage): static
    {
        if ($this->ouvrages->removeElement($ouvrage)) {
            // set the owning side to null (unless already changed)
            if ($ouvrage->getSite() === $this) {
                $ouvrage->setSite(null);
            }
        }

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
            $equipement->setSite($this);
        }

        return $this;
    }

    public function removeEquipement(Equipement $equipement): static
    {
        if ($this->equipements->removeElement($equipement)) {
            // set the owning side to null (unless already changed)
            if ($equipement->getSite() === $this) {
                $equipement->setSite(null);
            }
        }

        return $this;
    }

    public function getDateArchive(): ?DateTimeInterface
    {
        return $this->dateArchive;
    }

    public function setDateArchive(?DateTimeInterface $dateArchive): static
    {
        $this->dateArchive = $dateArchive;

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
            $locPointMesureSite->setSiteId($this);
        }

        return $this;
    }

    public function removeLocPointMesureSite(LocPointMesureSite $locPointMesureSite): static
    {
        if ($this->locPointMesureSites->removeElement($locPointMesureSite)) {
            // set the owning side to null (unless already changed)
            if ($locPointMesureSite->getSiteId() === $this) {
                $locPointMesureSite->setSiteId(null);
            }
        }

        return $this;
    }

    public function getChildren(): Collection
    {
        $data = $this->getOuvrages();
        if ($data->isEmpty()) {
            return $this->getEquipements();
        }
        return $data;
    }
}
