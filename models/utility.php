<?php

static function Dice( $numDice, $numSides, $bonus )
{
	$total = 0;
	for ($i=0;$i<$numDice;++$i)
		$total += rand( 1, $numSides );
	$total += $bonus;
	return $total;
}

?>