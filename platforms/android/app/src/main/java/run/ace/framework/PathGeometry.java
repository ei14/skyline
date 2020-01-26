//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------
package Windows.UI.Xaml.Controls;

enum SegmentType {
    None,
    Line,
    Bezier,
    QuadraticBezier,
    Arc,
    PolyLine,
    PolyBezier,
    PolyQuadraticBezier
}

public class PathGeometry extends Geometry {
    public PathFigureCollection figures;
    public FillRule fillRule;
}
