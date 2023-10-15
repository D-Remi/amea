<?php

namespace App\Entity;

use DateTime;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\PresenceRepository;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PresenceRepository::class)]
class Presence
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'presences')]
    private ?Cours $nom = null;
    
    /**
     * @Groups({"presence"})
     */
    #[ORM\ManyToOne(inversedBy: 'presences')]
    private ?Eleve $eleve = null;
    /**
     * @Groups({"presence"})
     */
    #[ORM\Column]
    private ?int $statut = null;
    /**
     * @Groups({"presence"})
     */
    #[ORM\ManyToOne(inversedBy: 'presences')]
    private ?date $date = null;

    public function __construct()
    {
       //
    }


    public function getId(): ?int
    {
        return $this->id;
    }


    public function getNom(): ?Cours
    {
        return $this->nom;
    }

    public function setNom(?Cours $nom): self
    {
        $this->nom = $nom;

        return $this;
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

    public function getStatut(): ?int
    {
        return $this->statut;
    }

    public function setStatut(int $statut): self
    {
        $this->statut = $statut;

        return $this;
    }

    public function getDate(): ?date
    {
        return $this->date;
    }

    public function setDate(?date $date): self
    {
        $this->date = $date;

        return $this;
    }
}
