<?php

namespace App\Entity;

use App\Repository\VilleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: VilleRepository::class)]
class Ville
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('defaultSite')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['defaultSite', 'defaultVille'])]
    private ?string $nom = null;

    #[Groups(['defaultVille'])]
    #[ORM\Column(length: 255)]
    private ?string $codePostal = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 12, scale: 9)]
    private ?string $longitude = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 12, scale: 9)]
    private ?string $latitude = null;

    #[Groups(['defaultVille'])]
    #[ORM\Column(length: 5)]
    private ?string $departement = null;

    #[ORM\OneToMany(targetEntity: Site::class, mappedBy: 'ville')]
    private Collection $sites;

    /**
     * @var Collection<int, Societe>
     */
    #[ORM\OneToMany(targetEntity: Societe::class, mappedBy: 'ville')]
    private Collection $societes;

    public function __construct()
    {
        $this->sites = new ArrayCollection();
        $this->societes = new ArrayCollection();
    }

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

    public function getCodePostal(): ?string
    {
        return $this->codePostal;
    }

    public function setCodePostal(string $codePostal): static
    {
        $this->codePostal = $codePostal;

        return $this;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(string $longitude): static
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(string $latitude): static
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getDepartement(): ?string
    {
        return $this->departement;
    }

    public function setDepartement(string $departement): static
    {
        $this->departement = $departement;

        return $this;
    }

    /**
     * @return Collection<int, Site>
     */
    public function getSites(): Collection
    {
        return $this->sites;
    }

    public function addSite(Site $site): static
    {
        if (!$this->sites->contains($site)) {
            $this->sites->add($site);
            $site->setVille($this);
        }

        return $this;
    }

    public function removeSite(Site $site): static
    {
        if ($this->sites->removeElement($site)) {
            // set the owning side to null (unless already changed)
            if ($site->getVille() === $this) {
                $site->setVille(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Societe>
     */
    public function getSocietes(): Collection
    {
        return $this->societes;
    }

    public function addSociete(Societe $societe): static
    {
        if (!$this->societes->contains($societe)) {
            $this->societes->add($societe);
            $societe->setVille($this);
        }

        return $this;
    }

    public function removeSociete(Societe $societe): static
    {
        if ($this->societes->removeElement($societe)) {
            // set the owning side to null (unless already changed)
            if ($societe->getVille() === $this) {
                $societe->setVille(null);
            }
        }

        return $this;
    }
}
