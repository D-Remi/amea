<?php

namespace App\Controller\Admin;

use App\Entity\Paiement;
use App\Entity\Inscription;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class InscriptionCrudController extends AbstractCrudController
{
    
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    
    public static function getEntityFqcn(): string
    {
        return Inscription::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Inscription')
            ->setEntityLabelInPlural('Inscriptions')
            ->setSearchFields(['id', 'moyenPaiement']);
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            AssociationField::new('eleve','eleve'),
            AssociationField::new('cours','cours'),
            NumberField::new('montant','montant total'),
          
            TextField::new('quantite', 'Nombre de paiement')
                ->hideOnForm()
                ->formatValue(function ($value, $entity) {
                    return $this->getQuantiteForInscription($entity);
                }),
                
            TextField::new('amount', 'Restant du')
                ->hideOnForm()
                ->formatValue(function ($value, $entity) {
                    return $this->getRestant($entity);
                }), 


        ];
    }

    private function getRestant($inscription)
    {
        $montant = $inscription->getMontant();

        $paiements = $this->entityManager->getRepository(Paiement::class)->findBy(['inscription' => $inscription]);

        $totalPaymentAmount = 0;
        foreach ($paiements as $paiement) {
            $totalPaymentAmount += $paiement->getAmount();
        }

        // Calculate and return the remaining amount
        $restant = $montant - $totalPaymentAmount;

        return $restant;
    }

    private function getQuantiteForInscription($inscription)
    {
        $paiement = $this->entityManager->getRepository(Paiement::class)->findBy(['inscription' => $inscription]);
        if ($paiement) {
            return count($paiement);
        }

        return 'Aucun';
    }

}
