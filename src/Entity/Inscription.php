<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\PaiementRepository;
use App\Repository\InscriptionRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: InscriptionRepository::class)]
class Inscription
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @Groups({"inscription"})
     */
    #[ORM\ManyToOne(inversedBy: 'inscriptions')]
    private ?Eleve $eleve = null;

    /**
     * @Groups({"inscription"})
     */
    #[ORM\ManyToOne(inversedBy: 'inscriptions')]
    private ?Cours $cours = null;

    /**
     * @Groups({"inscription"})
     */
    #[ORM\Column(nullable: true)]
    private ?float $montant = null;

    #[ORM\OneToMany(mappedBy: 'inscription', targetEntity: Paiement::class)]
    private Collection $paiements;

    private $moyenPaiement;
    private $quantite;
    private $amount;
    
    public function __construct()
    {
        $this->paiements = new ArrayCollection();
    }


    public function __toString(): string
    {
        return $this->id . '-' . $this->eleve . '-' . $this->cours . "- montant restant =" . $this->getRestant();
    }

    public function setMoyenPaiement($moyenPaiement)
    {
        $this->moyenPaiement = $moyenPaiement;
    }

    public function getMoyenPaiement()
    {
        return $this->moyenPaiement;
    }

    public function setQuantite($quantite)
    {
        $this->quantite = $quantite;
    }

    public function getQuantite()
    {
        return $this->quantite;
    }

    public function setAmount($amount)
    {
        $this->amount = $amount;
    }

    public function getAmount()
    {
        return $this->amount;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEleve(): ?Eleve
    {
        return $this->eleve;
    }

    public function setEleve(?Eleve $eleve): self
    {
        $this->eleve = $eleve;

        return $this;
    }

    public function getCours(): ?Cours
    {
        return $this->cours;
    }

    public function setCours(?Cours $cours): self
    {
        $this->cours = $cours;

        return $this;
    }

    public function getMontant(): ?float
    {
        return $this->montant;
    }

    public function setMontant(?float $montant): self
    {
        $this->montant = $montant;

        return $this;
    }

    /**
     * @return Collection<int, Paiement>
     */
    public function getPaiements(): Collection
    {
        return $this->paiements;
    }

    public function addPaiement(Paiement $paiement): self
    {
        if (!$this->paiements->contains($paiement)) {
            $this->paiements->add($paiement);
            $paiement->setInscription($this);
        }

        return $this;
    }

    public function removePaiement(Paiement $paiement): self
    {
        if ($this->paiements->removeElement($paiement)) {
            // set the owning side to null (unless already changed)
            if ($paiement->getInscription() === $this) {
                $paiement->setInscription(null);
            }
        }

        return $this;
    }

    public function getRestant()
    {
        $totalPaiements = 0;

        foreach ($this->paiements as $paiement) {
            $totalPaiements += $paiement->getAmount();
        }

        return $this->montant - $totalPaiements;
    }
}
