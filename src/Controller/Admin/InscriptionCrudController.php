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
            NumberField::new('montant'),
            ChoiceField::new('moyenPaiement','Moyen de paiement')->setChoices(['cheque' => "cheque",'espece'=> 'espece', 'hello-asso' => 'hello-asso'])->onlyOnForms(),
            NumberField::new('quantite', 'Quantité')->onlyOnForms(),
            NumberField::new('amount', 'Montant')->onlyOnForms(),
            

            // only detail And Index
            TextField::new('moyenPaiement', 'Moyens de paiement')
                ->hideOnForm()
                ->formatValue(function ($value, $entity) {
                    return $this->getMoyenPaiementForInscription($entity);
                }),

            TextField::new('amount', 'Montant du paiement')
                ->hideOnForm()
                ->formatValue(function ($value, $entity) {
                    return $this->getAmountForInscription($entity);
                }),
            
            TextField::new('quantite', 'Nombre de paiement')
                ->hideOnForm()
                ->formatValue(function ($value, $entity) {
                    return $this->getQuantiteForInscription($entity);
                }), 

        ];
    }

    private function getMoyenPaiementForInscription($inscription)
    {
        $paiement = $this->entityManager->getRepository(Paiement::class)->findOneBy(['inscription' => $inscription]);

        if ($paiement) {
            return $paiement->getMoyen();
        }

        return 'Non défini';
    }

    private function getAmountForInscription($inscription)
    {
        $paiement = $this->entityManager->getRepository(Paiement::class)->findOneBy(['inscription' => $inscription]);

        if ($paiement) {
            return $paiement->getAmount();
        }

        return 'Non défini';
    }

    private function getQuantiteForInscription($inscription)
    {
        $paiement = $this->entityManager->getRepository(Paiement::class)->findOneBy(['inscription' => $inscription]);

        if ($paiement) {
            return $paiement->getQuantite();
        }

        return 'Non défini';
    }

}
