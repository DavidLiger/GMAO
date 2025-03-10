<?php

namespace App\Entity;

use App\Repository\EquipementRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: EquipementRepository::class)]
class Equipement extends Bien
{
    #[Groups('defaultEquipement')]
    #[ORM\ManyToOne(inversedBy: 'equipements')]
    private ?Ouvrage $ouvrage = null;

    #[Groups('defaultEquipement')]
    #[ORM\ManyToOne(inversedBy: 'equipements')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Site $site = null;

    #[ORM\Column]
    #[Groups(['minimal', 'defaultBien'])]
    private ?bool $relevable = null;

    /**
     * @var Collection<int, Composant>
     */
    #[ORM\OneToMany(targetEntity: Composant::class, mappedBy: 'equipement')]
    #[Groups(['defaultBien'])]
    private Collection $composants;

    /**
     * @var Collection<int, Releve>
     */
    #[ORM\OneToMany(targetEntity: Releve::class, mappedBy: 'equipement')]
    private Collection $releves;

    public function __construct()
    {
        parent::__construct();
        $this->composants = new ArrayCollection();
        $this->releves = new ArrayCollection();
    }

    public function getOuvrage(): ?Ouvrage
    {
        return $this->ouvrage;
    }

    public function setOuvrage(?Ouvrage $ouvrage): static
    {
        $this->ouvrage = $ouvrage;

        return $this;
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

    public function isRelevable(): ?bool
    {
        return $this->relevable;
    }

    public function setRelevable(bool $relevable): static
    {
        $this->relevable = $relevable;

        return $this;
    }

    /**
     * @return Collection<int, Composant>
     */
    public function getComposants(): Collection
    {
        return $this->composants;
    }

    public function addComposant(Composant $composant): static
    {
        if (!$this->composants->contains($composant)) {
            $this->composants->add($composant);
            $composant->setEquipement($this);
        }

        return $this;
    }

    public function removeComposant(Composant $composant): static
    {
        if ($this->composants->removeElement($composant)) {
            // set the owning side to null (unless already changed)
            if ($composant->getEquipement() === $this) {
                $composant->setEquipement(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Releve>
     */
    public function getReleves(): Collection
    {
        return $this->releves;
    }

    public function addReleve(Releve $releve): static
    {
        if (!$this->releves->contains($releve)) {
            $this->releves->add($releve);
            $releve->setEquipement($this);
        }

        return $this;
    }

    public function removeReleve(Releve $releve): static
    {
        if ($this->releves->removeElement($releve)) {
            // set the owning side to null (unless already changed)
            if ($releve->getEquipement() === $this) {
                $releve->setEquipement(null);
            }
        }

        return $this;
    }

    public function getBreadcrumbs(): array
    {


        if ($this->getOuvrage() !== null) {
            return array_merge([
                ['nom' => $this->getSite()->getNom(), 'id' => $this->getSite()->getId()],
                ['nom' => $this->getOuvrage()->getNom(), 'id' => $this->getOuvrage()->getId()]
            ],
                parent::getBreadcrumbs()
            );
        } else {
            return array_merge([
                ['nom' => $this->getSite()->getNom(), 'id' => $this->getSite()->getId()],
            ],
                parent::getBreadcrumbs()
            );
        }
    }

    public function getChildren(): ?Collection
    {
        return $this->getComposants();
    }
}
