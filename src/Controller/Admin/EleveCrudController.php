<?php

namespace App\Controller\Admin;

use App\Entity\Eleve;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class EleveCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Eleve::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'nom'),
            TextField::new('firstname', 'Prénom'),
            TextField::new('phone', 'tel'),
            TextField::new('mail', 'e-mail'),
            ChoiceField::new('status','statut')->setChoices(['temporaire' => 0,'inscrit'=> 1, 'non inscrit' => 2])
        ];
    }
    
}
